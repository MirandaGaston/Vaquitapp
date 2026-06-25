# Vaquitapp — Contexto para Claude

Sos un desarrollador full stack senior ayudando con **Vaquitapp**, una demo universitaria de vaquitas digitales grupales con blockchain.

## Qué es el proyecto

App web para organizar aportes y gastos grupales de forma transparente. La identidad del usuario es su wallet de MetaMask. Los montos son ficticios (VAQ$) — no hay dinero real. Los registros quedan en un smart contract Solidity corriendo en Hardhat local.

## Stack

- **Frontend:** Next.js 14, Pages Router, JavaScript (no TypeScript)
- **Estilos:** Tailwind CSS v3
- **Blockchain:** Solidity 0.8.24 + Hardhat
- **Conexión:** ethers.js v6
- **Wallet:** MetaMask
- **Red:** Hardhat local, chainId 1337
- **Auth:** Solo wallet, sin email/password
- **DB:** No existe. Blockchain para datos principales, localStorage para apodo/avatar

## Estructura

```
/
├── contracts/Vaquitapp.sol        # Contrato único para todas las vaquitas
├── scripts/deploy.js              # Despliega y copia ABI + address al frontend
├── test/Vaquitapp.test.js         # 21 tests
├── hardhat.config.js
├── package.json                   # Dependencias de Hardhat (raíz)
└── frontend/
    ├── pages/
    │   ├── index.js               # Landing + conectar wallet
    │   ├── perfil.js              # Crear perfil (apodo + avatar)
    │   ├── mis-vaquitas.js        # Lista de vaquitas del usuario
    │   ├── crear.js               # Formulario crear vaquita
    │   └── vaquita/[id].js        # Detalle: miembros, aportes, gastos, historial
    ├── components/
    │   ├── Layout.js
    │   ├── VaquitaCard.js
    │   ├── MemberList.js
    │   ├── MovimientosList.js
    │   ├── TxModal.js             # Modal de confirmación de transacción
    │   └── DemoModeBanner.js
    ├── lib/
    │   ├── contract.js            # ABI embebido + helpers ethers.js v6
    │   ├── storage.js             # localStorage helpers
    │   └── demoData.js            # Datos mock para modo demo
    ├── public/contract-address.json   # Se genera al hacer deploy
    └── package.json
```

## Cómo levantar el proyecto (orden obligatorio)

### 1. Instalar dependencias

```bash
# En la raíz del proyecto
npm install

# En el frontend
cd frontend && npm install
```

### 2. Levantar el nodo Hardhat (dejar corriendo en una terminal)

```bash
# Desde la raíz
npx hardhat node
```

Hardhat muestra 20 wallets con claves privadas. Anotá las primeras dos.

### 3. Desplegar el contrato (en otra terminal)

```bash
# Desde la raíz
npm run deploy
```

Esto compila el contrato, lo despliega y escribe automáticamente:
- `frontend/public/contract-address.json` — dirección del contrato
- `frontend/lib/abi.json` — ABI (no requerido, el ABI ya está embebido en contract.js)

### 4. Correr el frontend (en otra terminal)

```bash
cd frontend
npm run dev
```

Abrir: **http://localhost:3000**

### 5. Configurar MetaMask

1. Instalar MetaMask en Chrome/Firefox si no está
2. Agregar red manual:
   - Nombre: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Símbolo: `ETH`
3. Importar las cuentas que mostró `hardhat node`:
   - Cuenta #0 → admin (Mati)
   - Cuenta #1 → miembro (Lau)

### 6. Modo demo (sin MetaMask)

Si MetaMask no está disponible o algo falla, hacer clic en **"Entrar en modo demo"** en la landing. Los datos del caso "Regalo para el cumple de Sofi" están pre-cargados y la UI es completamente navegable.

## Correr tests

```bash
# Desde la raíz
npm test
```

21 tests — todos deben pasar en verde.

## Roles en el contrato

| Valor uint8 | Rol | Permisos |
|-------------|-----|----------|
| 0 | None | Puede solicitar unirse |
| 1 | Pending | Espera aprobación |
| 2 | Approved | Puede aportar |
| 3 | Admin | Puede aportar + cargar gastos + aprobar miembros |

## Flujo de demo principal

Caso: **"Regalo para el cumple de Sofi"**

1. Landing → Conectar MetaMask (cuenta #0)
2. Crear perfil → apodo "Mati"
3. Nueva vaquita → nombre "Regalo para el cumple de Sofi 🎁", categoría Regalo, objetivo 100000
4. Cambiar a cuenta #1 en MetaMask → crear perfil "Lau"
5. Ir a /vaquita/1 → "Solicitar unirme"
6. Volver a cuenta #0 → Aprobar a Lau
7. Como Lau → Aportar VAQ$ 30.000
8. Como Mati → Aportar VAQ$ 40.000
9. Como Mati → Cargar gasto "Compra del regalo" VAQ$ 55.000
10. Ver historial y saldo (VAQ$ 15.000 restante)

## Decisiones de diseño importantes

- El ABI está embebido en `frontend/lib/contract.js` para no depender de que el artifact exista
- El `contract-address.json` con address vacía (`""`) activa automáticamente el modo demo
- Todos los montos en el contrato son `uint256` simples — NO se usa `parseEther`, son enteros directos
- En ethers.js v6 los uint256 retornan como `BigInt` — convertir con `Number()` antes de mostrar
- El modo demo usa `await sleep(1500)` para simular el tiempo de confirmación blockchain
- `localStorage` solo guarda `{ nickname, photo, address }` — todo lo demás viene del contrato

## Comandos útiles

```bash
# Compilar contrato
npx hardhat compile

# Tests
npm test

# Deploy (requiere hardhat node corriendo)
npm run deploy

# Frontend dev
cd frontend && npm run dev

# Build de producción del frontend
cd frontend && npm run build
```

## Qué NO tiene este MVP (no agregar sin consultar)

- TypeScript
- Base de datos real
- Pagos reales
- Google login / email
- IPFS
- Multisig
- Votaciones
- Notificaciones en tiempo real
- Soporte multi-red
