<div align="center">

# 🐄 Vaquitapp

**Gastos grupales transparentes, respaldados por blockchain.**

[![Demo en vivo](https://img.shields.io/badge/Demo%20en%20vivo-Vercel-black?style=for-the-badge&logo=vercel)](https://vaquitapp-gamma.vercel.app)
[![Ver video](https://img.shields.io/badge/Video%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/oUik1y96Q9g?si=f94wyolPpNOkkt6a)
[![Tests](https://img.shields.io/badge/Tests-21%20passing-brightgreen?style=for-the-badge)](#tests)

*Hackathon · Teoría de la Computación II · Universidad Champagnat · 2026*

</div>

---

## Video demo

<div align="center">

[![Ver demo en YouTube](https://img.youtube.com/vi/oUik1y96Q9g/0.jpg)](https://youtu.be/oUik1y96Q9g?si=f94wyolPpNOkkt6a)

</div>

---

## El problema

Cuando un grupo organiza una vaquita, siempre pasa lo mismo:

> *"¿Quién puso qué?", "¿Cuánto gastamos?", "¿Me podés mostrar el recibo?"*

Las herramientas actuales (WhatsApp, hojas de cálculo, Splitwise) son **modificables**. Cualquiera puede cambiar los datos — incluso el organizador.

## La solución

Vaquitapp registra cada aporte y gasto en un **smart contract en blockchain**. El historial es público, auditable e **inmutable** — no lo puede cambiar nadie, ni el creador del grupo.

- Sin email ni contraseña — la identidad es tu **wallet MetaMask**
- Montos simbólicos en **VAQ$** — sin dinero real
- **Modo demo** disponible sin MetaMask

---

## Entregables del proyecto

Todos los archivos requeridos se encuentran en la **raíz del repositorio**:

| Entregable | Archivo | Ubicación |
|------------|---------|-----------|
| Lean Canvas | [LeanCanvas-Vaquitapp.pdf](LeanCanvas-Vaquitapp.pdf) | `/LeanCanvas-Vaquitapp.pdf` |
| Memoria Técnica | [MemoriaTecnica-Vaquitapp.pdf](MemoriaTecnica-Vaquitapp.pdf) | `/MemoriaTecnica-Vaquitapp.pdf` |
| Pitch Deck | [Presentación - Vaquitapp.pptx](Presentación%20-%20Vaquitapp.pptx) | `/Presentación - Vaquitapp.pptx` |
| Video Demo | [Ver en YouTube](https://youtu.be/oUik1y96Q9g?si=f94wyolPpNOkkt6a) | YouTube (link arriba) |
| Evidencias MVP | [Ver carpeta /docs](docs/) | `/docs/` |
| Discurso oral | [SPEECH.md](SPEECH.md) | `/SPEECH.md` |
| Código fuente | [/frontend](frontend/) y [/contracts](contracts/) | Ver estructura abajo |

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 · JavaScript · Pages Router |
| Estilos | Tailwind CSS v3 |
| Smart Contract | Solidity 0.8.24 |
| Entorno blockchain | Hardhat 2.22 |
| Integración web3 | ethers.js v6 |
| Wallet / Auth | MetaMask |
| Red local | Hardhat (chainId 1337) |
| Deploy frontend | Vercel |
| IA de desarrollo | Claude Code (Anthropic) |

---

## Cómo levantar el proyecto

### Prerrequisitos

- Node.js v18+
- MetaMask en el navegador
- 3 terminales abiertas

### 1. Instalar dependencias

```bash
# Raíz del proyecto
npm install

# Frontend
cd frontend && npm install
```

### 2. Levantar el nodo Hardhat

```bash
npx hardhat node
```

Dejá esta terminal corriendo. Hardhat muestra 20 wallets — anotá las claves privadas de las primeras dos.

### 3. Desplegar el contrato

```bash
npm run deploy
```

Esto compila `Vaquitapp.sol`, lo despliega y escribe la dirección en `frontend/public/contract-address.json`.

### 4. Configurar MetaMask

| Campo | Valor |
|-------|-------|
| Nombre | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `1337` |
| Símbolo | ETH |

Importá la cuenta #0 (admin) y la cuenta #1 (miembro) con sus claves privadas.

### 5. Correr el frontend

```bash
cd frontend
npm run dev
```

Abrir: **http://localhost:3000**

---

## Flujo de demo

**Caso: "Regalo para el cumple de Sofi 🎁"**

| Paso | Acción | Cuenta |
|------|--------|--------|
| 1 | Conectar MetaMask y crear perfil "Mati" | #0 |
| 2 | Crear vaquita — objetivo VAQ$ 100.000 | #0 |
| 3 | Crear perfil "Lau" y solicitar unirse | #1 |
| 4 | Aprobar a Lau como miembro | #0 |
| 5 | Cargar aporte VAQ$ 30.000 | #1 |
| 6 | Cargar aporte VAQ$ 40.000 | #0 |
| 7 | Registrar gasto "Compra del regalo" VAQ$ 55.000 | #0 |
| 8 | Ver historial — saldo restante VAQ$ 15.000 | cualquiera |

> **Sin MetaMask:** hacé clic en "Entrar en modo demo" en la landing — el flujo completo es navegable con datos mock.

---

## Arquitectura

```
/
├── contracts/
│   └── Vaquitapp.sol          # Contrato: grupos, roles, aportes, gastos
├── scripts/
│   └── deploy.js              # Compila, despliega y exporta ABI + address
├── test/
│   └── Vaquitapp.test.js      # 21 tests (Hardhat + Chai)
└── frontend/
    ├── pages/
    │   ├── index.js           # Landing + conectar wallet
    │   ├── perfil.js          # Crear/editar perfil
    │   ├── mis-vaquitas.js    # Lista de vaquitas del usuario
    │   ├── crear.js           # Nueva vaquita
    │   └── vaquita/[id].js    # Detalle: miembros, aportes, gastos
    ├── components/            # Layout, VaquitaCard, MemberList, TxModal...
    └── lib/
        ├── contract.js        # ABI embebido + helpers ethers.js v6
        ├── storage.js         # localStorage (apodo, avatar)
        └── demoData.js        # Datos mock para modo demo
```

---

## Roles en el contrato

| Rol | Permisos |
|-----|----------|
| **Admin** | Aportar · cargar gastos · aprobar miembros |
| **Aprobado** | Aportar |
| **Pendiente** | Espera aprobación del admin |

---

## Tests

```bash
npm test
```

21 tests — crean grupos, solicitan ingreso, aprueban miembros, cargan aportes y gastos, validan roles y saldos.

---

## Roadmap

- [ ] Invitaciones por link / código QR
- [ ] Deploy en red pública (Polygon / Sepolia)
- [ ] Votaciones para aprobar gastos grandes
- [ ] Notificaciones en tiempo real con eventos blockchain
- [ ] IPFS para fotos de perfil

---

<div align="center">

Hecho con 💚 para Hackathon T. de Comp II · Universidad Champagnat

</div>
