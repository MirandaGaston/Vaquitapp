/**
 * Helpers para manejar perfil en localStorage.
 * Solo almacena datos auxiliares (apodo, foto).
 * La identidad principal es la wallet.
 */

const PROFILES_KEY    = "vaquitapp_profiles";    // { address → profile }
const CURRENT_KEY     = "vaquitapp_current";     // address activa
const DEMO_MODE_KEY   = "vaquitapp_demo_mode";

function getAllProfiles() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
  } catch {
    return {};
  }
}

// Migra perfil del formato viejo (vaquitapp_profile) al nuevo si existe
function migrateOldProfile() {
  const OLD_KEY = "vaquitapp_profile";
  const old = localStorage.getItem(OLD_KEY);
  if (!old) return;
  try {
    const p = JSON.parse(old);
    if (p?.address && p?.nickname) {
      saveProfile(p); // guarda en el nuevo formato
    }
    localStorage.removeItem(OLD_KEY);
  } catch {}
}

// Devuelve el perfil de la dirección indicada, o el perfil activo si no se pasa address
export function getProfile(address) {
  if (typeof window === "undefined") return null;
  migrateOldProfile();
  const addr = address || localStorage.getItem(CURRENT_KEY);
  if (!addr) return null;
  return getAllProfiles()[addr.toLowerCase()] || null;
}

// Devuelve true si ya existe un perfil completo (con apodo) para esa address
export function hasProfile(address) {
  if (!address) return false;
  const p = getAllProfiles()[address.toLowerCase()];
  return !!(p?.nickname);
}

export function saveProfile(profile) {
  if (typeof window === "undefined") return;
  if (!profile?.address) return;
  const all = getAllProfiles();
  all[profile.address.toLowerCase()] = profile;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(all));
  localStorage.setItem(CURRENT_KEY, profile.address.toLowerCase());
}

export function setCurrentAddress(address) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_KEY, address.toLowerCase());
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  // Solo limpia la sesión activa, mantiene los perfiles guardados
  localStorage.removeItem(CURRENT_KEY);
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
