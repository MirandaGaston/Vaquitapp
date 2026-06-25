/**
 * Datos mock para el modo demo.
 * Se usan cuando MetaMask no está conectado o Hardhat no está corriendo.
 */

export const DEMO_WALLET = "0xDemo...1234";
export const DEMO_WALLET_2 = "0xDemo...5678";

export const DEMO_PROFILE = {
  nickname: "Mati",
  photo: "",
  address: "0x1234567890123456789012345678901234567890",
};

export const DEMO_GROUPS = [
  {
    id: 1,
    name: "Regalo para el cumple de Sofi 🎁",
    description: "Juntamos plata entre amigos para comprarle un regalo sorpresa a Sofi.",
    isPublic: true,
    category: "Regalo",
    goal: 100000,
    admin: "0x1234567890123456789012345678901234567890",
    totalContributed: 70000,
    totalSpent: 55000,
    saldo: 15000,
    createdAt: Math.floor(Date.now() / 1000) - 86400,
    exists: true,
  },
  {
    id: 2,
    name: "Asado del viernes 🥩",
    description: "Organizamos el asado de fin de mes.",
    isPublic: true,
    category: "Comida",
    goal: 30000,
    admin: "0x1234567890123456789012345678901234567890",
    totalContributed: 25000,
    totalSpent: 18000,
    saldo: 7000,
    createdAt: Math.floor(Date.now() / 1000) - 172800,
    exists: true,
  },
];

export const DEMO_MEMBERS = {
  1: [
    { wallet: "0x1234567890123456789012345678901234567890", nickname: "Mati", status: 3, joinedAt: Math.floor(Date.now() / 1000) - 86400 },
    { wallet: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", nickname: "Lau", status: 2, joinedAt: Math.floor(Date.now() / 1000) - 82800 },
    { wallet: "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", nickname: "Pedro", status: 2, joinedAt: Math.floor(Date.now() / 1000) - 79200 },
    { wallet: "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", nickname: "Juli", status: 1, joinedAt: 0 },
  ],
  2: [
    { wallet: "0x1234567890123456789012345678901234567890", nickname: "Mati", status: 3, joinedAt: Math.floor(Date.now() / 1000) - 172800 },
    { wallet: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", nickname: "Lau", status: 2, joinedAt: Math.floor(Date.now() / 1000) - 169200 },
  ],
};

export const DEMO_CONTRIBUTIONS = {
  1: [
    { id: 0, contributor: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", nickname: "Lau", amount: 30000, note: "Mi parte 💜", timestamp: Math.floor(Date.now() / 1000) - 82000 },
    { id: 1, contributor: "0x1234567890123456789012345678901234567890", nickname: "Mati", amount: 40000, note: "La mía + la de Sofi", timestamp: Math.floor(Date.now() / 1000) - 75000 },
  ],
  2: [
    { id: 0, contributor: "0x1234567890123456789012345678901234567890", nickname: "Mati", amount: 15000, note: "Arranque", timestamp: Math.floor(Date.now() / 1000) - 170000 },
    { id: 1, contributor: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", nickname: "Lau", amount: 10000, note: "Mi parte", timestamp: Math.floor(Date.now() / 1000) - 165000 },
  ],
};

export const DEMO_EXPENSES = {
  1: [
    { id: 0, recorder: "0x1234567890123456789012345678901234567890", nickname: "Mati", amount: 55000, concept: "Compra del regalo 🎁", category: "Regalo", timestamp: Math.floor(Date.now() / 1000) - 70000 },
  ],
  2: [
    { id: 0, recorder: "0x1234567890123456789012345678901234567890", nickname: "Mati", amount: 18000, concept: "Carne y verduras", category: "Comida", timestamp: Math.floor(Date.now() / 1000) - 160000 },
  ],
};

export const DEMO_USER_GROUPS = [1, 2];
