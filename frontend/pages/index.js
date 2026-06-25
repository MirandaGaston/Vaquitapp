import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connectWallet } from "../lib/contract";
import { getProfile, saveProfile, setCurrentAddress, hasProfile, setDemoMode, isDemoMode } from "../lib/storage";
import { DEMO_PROFILE } from "../lib/demoData";

export default function Landing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  // Si ya hay sesión activa, ir directo a mis-vaquitas
  useEffect(() => {
    const profile = getProfile();
    if (profile?.nickname) {
      router.replace("/mis-vaquitas");
    }
  }, []);

  async function handleConnect() {
    setError("");
    setLoading(true);
    try {
      const { address } = await connectWallet();
      if (hasProfile(address)) {
        // Ya tiene perfil guardado para esta wallet → entrar directo
        setCurrentAddress(address);
        router.push("/mis-vaquitas");
      } else {
        // Wallet nueva → guardar address y pedir apodo
        saveProfile({ address });
        router.push("/perfil");
      }
    } catch (err) {
      // Si MetaMask no está instalado, sugerir modo demo
      if (err.message.includes("no está instalado") || err.message.includes("not installed")) {
        setError("MetaMask no está instalado. Podés usar el modo demo para ver la app igual.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDemo() {
    setDemoMode(true);
    saveProfile({ ...DEMO_PROFILE });
    router.push("/mis-vaquitas");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Logo animado */}
        <div className="animate-bounce-in">
          <div className="text-8xl mb-4 select-none">🐄</div>
        </div>

        <div className="animate-fade-in text-center max-w-lg">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Vaquitapp
          </h1>
          <p className="text-xl text-orange-500 font-semibold mb-3">
            La forma más transparente y divertida
          </p>
          <p className="text-lg text-gray-600 mb-8">
            de organizar gastos grupales 🎉
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { emoji: "👛", text: "Conectá tu wallet" },
              { emoji: "🐄", text: "Creá una vaquita" },
              { emoji: "⛓️", text: "Registrá en blockchain" },
            ].map((f) => (
              <div key={f.emoji} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100">
                <div className="text-3xl mb-1">{f.emoji}</div>
                <p className="text-xs font-semibold text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleConnect}
            disabled={loading}
            className="btn-primary text-lg px-8 py-4 shadow-lg disabled:opacity-60 w-full sm:w-auto"
          >
            {loading ? (
              <><div className="spinner" /> Conectando...</>
            ) : (
              <> 🦊 Conectar MetaMask</>
            )}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 animate-fade-in">
              <p className="font-semibold mb-1">⚠️ {error}</p>
              <button
                onClick={handleDemo}
                className="mt-2 text-orange-600 font-bold underline hover:no-underline"
              >
                → Entrar en Modo Demo
              </button>
            </div>
          )}

          {/* Modo demo visible */}
          <div className="mt-6">
            <button
              onClick={handleDemo}
              className="text-sm text-gray-400 hover:text-orange-500 transition-colors underline"
            >
              🎭 Entrar en modo demo (sin MetaMask)
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="py-6 text-center space-y-1">
        <p className="text-xs text-gray-400">
          🔒 Sin banco · Sin email · Sin contraseña · Solo tu wallet
        </p>
        <p className="text-xs text-gray-400">
          ⛓️ Registros auditables en Ethereum (Hardhat local) · Los montos son ficticios (VAQ$)
        </p>
      </div>
    </div>
  );
}
