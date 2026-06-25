# 🐄 Vaquitapp

> La forma más transparente y divertida de organizar gastos grupales.

Demo universitaria — Proyecto integrador de blockchain + web3 + Next.js.

---

## ¿Qué es Vaquitapp?

Vaquitapp permite crear **vaquitas digitales grupales**: grupos donde un conjunto de personas puede:

- Aportar fondos ficticios (VAQ$)
- Registrar gastos con categoría y concepto
- Ver un historial transparente auditado por blockchain
- Aprobar miembros y gestionar roles

No maneja dinero real. Los montos son **lógicos y ficticios** mostrados como VAQ$.  
La identidad del usuario es su **wallet** de MetaMask — sin email, sin contraseña.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (Pages Router) + JavaScript |
| Estilos | Tailwind CSS v3 |
| Smart Contract | Solidity 0.8.24 |
| Entorno blockchain | Hardhat |
| Conexión frontend/contrato | ethers.js v6 |
| Wallet | MetaMask |
| Red demo | Hardhat local (chainId 1337) |
| Datos auxiliares | localStorage (apodo, avatar) |

---

## Estructura del proyecto

```
/
├── contracts/
│   └── Vaquitapp.sol          # Contrato principal
├── scripts/
│   └── deploy.js              # Script de despliegue
├── test/
│   └── Vaquitapp.test.js      # Tests completos
├── frontend/
│   ├── pages/
│   │   ├── index.js           # Landing
│   │   ├── perfil.js          # Crear/editar perfil
│   │   ├── mis-vaquitas.js    # Lista de vaquitas del usuario
│   │   ├── crear.js           # Crear vaquita
│   │   └── vaquita/[id].js    # Detalle de vaquita
│   ├── components/
│   │   ├── Layout.js
│   │   ├── VaquitaCard.js
│   │   ├── MemberList.js
│   │   ├── MovimientosList.js
│   │   ├── TxModal.js
│   │   └── DemoModeBanner.js
│   ├── lib/
│   │   ├── contract.js        # Integración ethers.js
│   │   ├── storage.js         # localStorage helpers
│   │   └── demoData.js        # Datos mock para modo demo
│   ├── styles/globals.css
│   └── public/contract-address.json
├── hardhat.config.js
├── package.json
├── README.md
├── DEMO_SCRIPT.md
├── VIDEO_SCRIPT.md
└── SPEECH.md
```

---

## Instalación

### Prerrequisitos

- Node.js v18+
- npm v9+
- MetaMask instalado en el navegador

### 1. Instalar dependencias de Hardhat (raíz)

```bash
cd C:\Users\alejo\2do\Vaquitapp
npm install
```

### 2. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

---

## Correr la demo

### Paso 1 — Levantar Hardhat (en una terminal)

```bash
# Desde la raíz del proyecto
npx hardhat node
```

Esto levanta una blockchain local en `http://127.0.0.1:8545`.  
Hardhat muestra 20 wallets con ETH de prueba. **Anotá la clave privada de las primeras 2** para importarlas en MetaMask.

### Paso 2 — Desplegar el contrato (en otra terminal)

```bash
# Desde la raíz del proyecto
npm run deploy
```

Esto:
1. Compila `Vaquitapp.sol`
2. Despliega en la red local
3. Escribe la dirección en `frontend/public/contract-address.json`
4. Copia el ABI en `frontend/lib/abi.json`

### Paso 3 — Configurar MetaMask

1. Abrí MetaMask
2. Agregá una red personalizada:
   - **Nombre**: Hardhat Local
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Símbolo**: ETH
3. Importá la cuenta #0 de Hardhat (clave privada que mostró el nodo)
4. Para simular otro usuario: importá la cuenta #1

### Paso 4 — Correr el frontend

```bash
cd frontend
npm run dev
```

Abrir: [http://localhost:3000](http://localhost:3000)

---

## Flujo de demo paso a paso

1. Abrí la app → conectá MetaMask (cuenta #0)
2. Creá el perfil: apodo "Mati", avatar 🦊
3. Creá la vaquita: "Regalo para el cumple de Sofi 🎁" — Categoría: Regalo — Objetivo: 100000
4. Cambiá a cuenta #1 en MetaMask → recargá la página
5. Creá perfil: apodo "Lau"
6. Andá al detalle de la vaquita (vaquita/1) → "Solicitar unirme"
7. Volvé a cuenta #0 → aprobá a Lau
8. Volvé a cuenta #1 → cargá aporte: VAQ$ 30.000
9. En cuenta #0 → cargá aporte: VAQ$ 40.000
10. En cuenta #0 → cargá gasto: "Compra del regalo", VAQ$ 55.000
11. Mostrá el historial → señalá los eventos en blockchain

---

## Modo demo (sin MetaMask)

Si MetaMask no está disponible, la app ofrece **Modo Demo** automáticamente.  
Los datos son mock pero el flujo completo es navegable y la UI es idéntica.  
Activar desde el botón "Entrar en modo demo" de la landing.

---

## Tests

```bash
# Desde la raíz
npm test
```

Cubre: crear grupo, solicitar ingreso, aprobar miembro, cargar aportes, cargar gastos, flujo completo.

---

## Qué queda fuera del MVP

- Sistema de invitaciones por link/código
- Notificaciones en tiempo real
- Explorador público de vaquitas
- Soporte multi-red (Sepolia, Polygon)
- IPFS para fotos de perfil
- Votaciones para aprobación colectiva de gastos
- Integración con pagos reales
