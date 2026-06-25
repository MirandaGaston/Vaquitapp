import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { getProfile, saveProfile, formatAddress } from "../lib/storage";

const AVATAR_OPTIONS = ["🐄", "🦊", "🐻", "🦁", "🐸", "🐼", "🦄", "🐙", "🦋", "🦖"];

export default function Perfil() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [avatar,   setAvatar]   = useState("🐄");
  const [address,  setAddress]  = useState("");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    const profile = getProfile();
    if (!profile?.address) {
      router.replace("/");
      return;
    }
    setAddress(profile.address);
    setNickname(profile.nickname || "");
    setAvatar(profile.photo || "🐄");
  }, []);

  function handleSave(e) {
    e.preventDefault();
    if (!nickname.trim()) return;
    setSaving(true);
    setTimeout(() => {
      saveProfile({ nickname: nickname.trim(), photo: avatar, address });
      setSaving(false);
      setSaved(true);
      setTimeout(() => router.push("/mis-vaquitas"), 800);
    }, 400);
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header simple sin nav completo para onboarding */}
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👤</div>
          <h1 className="text-3xl font-extrabold text-gray-800">Tu Perfil</h1>
          <p className="text-gray-500 mt-1">Elegí cómo te van a ver tus amigos en la vaquita</p>
        </div>

        <div className="card animate-slide-up">
          {/* Wallet conectada */}
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100 mb-6">
            <span className="text-2xl">⛓️</span>
            <div>
              <p className="text-xs font-semibold text-purple-700">Wallet conectada</p>
              <p className="text-sm font-mono text-gray-700 break-all">{address}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Avatar */}
            <div>
              <label className="label">Elegí tu avatar</label>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`text-3xl py-2 rounded-xl border-2 transition-all hover:scale-110
                      ${avatar === emoji
                        ? "border-orange-400 bg-orange-50 shadow-md scale-110"
                        : "border-transparent bg-gray-50 hover:border-orange-200"
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <span className="text-4xl">{avatar}</span>
              <div>
                <p className="font-bold text-gray-800">{nickname || "Tu apodo"}</p>
                <p className="text-xs text-gray-400">{formatAddress(address)}</p>
              </div>
            </div>

            {/* Apodo */}
            <div>
              <label className="label">Apodo *</label>
              <input
                className="input"
                type="text"
                placeholder="Ej: Mati, Lau, Pedro..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={30}
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving || saved || !nickname.trim()}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {saved ? "✅ ¡Listo! Redirigiendo..." : saving ? <><div className="spinner" /> Guardando...</> : "Guardar perfil →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          El apodo y avatar se guardan localmente. La wallet es tu identidad en blockchain.
        </p>
      </div>
    </div>
  );
}
