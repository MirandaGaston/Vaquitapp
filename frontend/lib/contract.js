/**
 * Integración con el contrato Vaquitapp usando ethers.js v6.
 *
 * Flujo:
 *   1. connectWallet()     → retorna address y signer
 *   2. getContract(signer) → retorna instancia del contrato
 *   3. Llamar funciones del contrato directamente
 *
 * Si el contrato no está desplegado aún, contract-address.json tendrá address ""
 * y la app mostrará el modo demo automáticamente.
 */

import { ethers } from "ethers";

// ABI embebido — se regenera automáticamente con `npm run deploy`
// Este es el ABI completo de Vaquitapp.sol
export const ABI = [
  "function groupCount() view returns (uint256)",

  "function createGroup(string name, string description, bool isPublic, string category, uint256 goal, string adminNickname) returns (uint256)",
  "function requestToJoinGroup(uint256 groupId, string nickname)",
  "function approveMember(uint256 groupId, address memberAddress)",
  "function addContribution(uint256 groupId, uint256 amount, string note, string nickname)",
  "function addExpense(uint256 groupId, uint256 amount, string concept, string category, string nickname)",

  "function getGroup(uint256 groupId) view returns (uint256 id, string name, string description, bool isPublic, string category, uint256 goal, address admin, uint256 totalContributed, uint256 totalSpent, uint256 saldo, uint256 createdAt)",
  "function getGroupMembers(uint256 groupId) view returns (tuple(address wallet, string nickname, uint8 status, uint256 joinedAt)[])",
  "function getGroupContributions(uint256 groupId) view returns (tuple(uint256 id, address contributor, string nickname, uint256 amount, string note, uint256 timestamp)[])",
  "function getGroupExpenses(uint256 groupId) view returns (tuple(uint256 id, address recorder, string nickname, uint256 amount, string concept, string category, uint256 timestamp)[])",
  "function getUserGroups(address user) view returns (uint256[])",
  "function getMemberStatus(uint256 groupId, address user) view returns (uint8)",
  "function getBalance(uint256 groupId) view returns (uint256)",
  "function getMemberCount(uint256 groupId) view returns (uint256)",

  "event GroupCreated(uint256 indexed groupId, string name, address indexed admin)",
  "event JoinRequested(uint256 indexed groupId, address indexed requester, string nickname)",
  "event MemberApproved(uint256 indexed groupId, address indexed member)",
  "event ContributionAdded(uint256 indexed groupId, address indexed contributor, uint256 amount, string note)",
  "event ExpenseAdded(uint256 indexed groupId, address indexed recorder, uint256 amount, string concept)",
];

let contractAddress = null;

async function loadContractAddress() {
  if (contractAddress) return contractAddress;
  try {
    const res = await fetch("/contract-address.json");
    if (!res.ok) throw new Error("No se encontró contract-address.json");
    const data = await res.json();
    contractAddress = data.address;
    return contractAddress;
  } catch {
    return null;
  }
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask no está instalado");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  // Verificar que está en la red correcta (chainId 1337 = Hardhat)
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 1337) {
    throw new Error(
      `Red incorrecta. Esperado: Hardhat (1337), actual: ${network.chainId}.\n\nAgregá la red Hardhat en MetaMask:\n• RPC URL: http://127.0.0.1:8545\n• Chain ID: 1337\n• Símbolo: ETH`
    );
  }

  return { provider, signer, address };
}

export function getProvider() {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getCurrentAddress() {
  if (!window.ethereum) return null;
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch {
    return null;
  }
}

// ─── Contrato ─────────────────────────────────────────────────────────────────

export async function getContract(signer) {
  const addr = await loadContractAddress();
  if (!addr) throw new Error("Contrato no desplegado. Corrí: npm run deploy");
  return new ethers.Contract(addr, ABI, signer);
}

export async function getReadOnlyContract() {
  if (!window.ethereum) throw new Error("MetaMask no disponible");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const addr = await loadContractAddress();
  if (!addr) throw new Error("Contrato no desplegado");
  return new ethers.Contract(addr, ABI, provider);
}

// ─── Helpers de conversión ────────────────────────────────────────────────────

// Normaliza un resultado BigInt → Number para mostrar en UI
export function toNum(val) {
  if (val === undefined || val === null) return 0;
  return Number(val);
}

// Convierte un objeto grupo retornado por el contrato a un plain object
export function parseGroup(raw) {
  return {
    id:               toNum(raw.id),
    name:             raw.name,
    description:      raw.description,
    isPublic:         raw.isPublic,
    category:         raw.category,
    goal:             toNum(raw.goal),
    admin:            raw.admin,
    totalContributed: toNum(raw.totalContributed),
    totalSpent:       toNum(raw.totalSpent),
    saldo:            toNum(raw.saldo),
    createdAt:        toNum(raw.createdAt),
  };
}

export function parseMember(raw) {
  return {
    wallet:   raw.wallet,
    nickname: raw.nickname,
    status:   toNum(raw.status),
    joinedAt: toNum(raw.joinedAt),
  };
}

export function parseContribution(raw) {
  return {
    id:          toNum(raw.id),
    contributor: raw.contributor,
    nickname:    raw.nickname,
    amount:      toNum(raw.amount),
    note:        raw.note,
    timestamp:   toNum(raw.timestamp),
  };
}

export function parseExpense(raw) {
  return {
    id:        toNum(raw.id),
    recorder:  raw.recorder,
    nickname:  raw.nickname,
    amount:    toNum(raw.amount),
    concept:   raw.concept,
    category:  raw.category,
    timestamp: toNum(raw.timestamp),
  };
}

// ─── Funciones de alto nivel ──────────────────────────────────────────────────

export async function fetchGroup(groupId, signer) {
  const contract = await getContract(signer);
  const raw = await contract.getGroup(groupId);
  return parseGroup(raw);
}

export async function fetchGroupMembers(groupId, signer) {
  const contract = await getContract(signer);
  const raw = await contract.getGroupMembers(groupId);
  return raw.map(parseMember);
}

export async function fetchGroupContributions(groupId, signer) {
  const contract = await getContract(signer);
  const raw = await contract.getGroupContributions(groupId);
  return raw.map(parseContribution);
}

export async function fetchGroupExpenses(groupId, signer) {
  const contract = await getContract(signer);
  const raw = await contract.getGroupExpenses(groupId);
  return raw.map(parseExpense);
}

export async function fetchUserGroups(address, signer) {
  const contract = await getContract(signer);
  const ids = await contract.getUserGroups(address);
  return ids.map(toNum);
}

export async function fetchMemberStatus(groupId, address, signer) {
  const contract = await getContract(signer);
  const status = await contract.getMemberStatus(groupId, address);
  return toNum(status);
}

// ─── Verificar si contrato está disponible ────────────────────────────────────

export async function isContractAvailable() {
  try {
    const addr = await loadContractAddress();
    if (!addr) return false;
    if (!window.ethereum) return false;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const code = await provider.getCode(addr);
    return code !== "0x";
  } catch {
    return false;
  }
}
