/**
 * Helpers para manejar perfil en localStorage.
 * Solo almacena datos auxiliares (apodo, foto).
 * La identidad principal es la wallet.
 */

const PROFILE_KEY = "vaquitapp_profile";
const DEMO_MODE_KEY = "vaquitapp_demo_mode";

export function getProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
}

export function isDemoMode() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_MODE_KEY) === "true";
}

export function setDemoMode(value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_MODE_KEY, value ? "true" : "false");
}

export function formatAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount) {
  if (amount === undefined || amount === null) return "0";
  const num = typeof amount === "bigint" ? Number(amount) : Number(amount);
  return new Intl.NumberFormat("es-AR").format(num);
}

export function formatDate(timestamp) {
  if (!timestamp) return "—";
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : Number(timestamp);
  const date = new Date(ts * 1000);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function categoryEmoji(cat) {
  const map = {
    Regalo: "🎁",
    Comida: "🍕",
    Evento: "🎉",
    Transporte: "🚗",
    Otros: "📦",
    Asado: "🥩",
  };
  return map[cat] || "📦";
}

export function statusLabel(status) {
  // status puede ser Number o BigInt
  const s = Number(status);
  if (s === 3) return { label: "Admin", css: "badge-admin", emoji: "👑" };
  if (s === 2) return { label: "Miembro", css: "badge-member", emoji: "✅" };
  if (s === 1) return { label: "Pendiente", css: "badge-pending", emoji: "⏳" };
  return { label: "Desconocido", css: "badge-pending", emoji: "❓" };
}
