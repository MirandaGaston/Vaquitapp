import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import TxModal from "../components/TxModal";
import { connectWallet, getContract } from "../lib/contract";
import { getProfile, isDemoMode } from "../lib/storage";
import { DEMO_GROUPS } from "../lib/demoData";

const CATEGORIES = ["Regalo", "Comida", "Evento", "Transporte", "Viaje", "Tecnología", "Salud", "Otros"];

export default function CrearVaquita() {
  const router = useRouter();

  const [form, setForm] = useState({
    name:        "",
    description: "",
    isPublic:    true,
    category:    "Regalo",
    goal:        "",
  });

  const [txState,   setTxState]   = useState("idle");
  const [txMessage, setTxMessage] = useState("");
  const [demoMode,  setDemoMode_] = useState(false);
  const [profile,   setProfile]   = useState(null);

  useEffect(() => {
    const p = getProfile();
    if (!p?.address) { router.replace("/"); return; }
    setProfile(p);
    setDemoMode_(isDemoMode());
  }, []);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setTxState("loading");
    setTxMessage("Creando la vaquita en blockchain...");

    if (demoMode) {
      await new Promise((r) => setTimeout(r, 1800));
      const newId = DEMO_GROUPS.length + 1;
      setTxState("success");
      setTxMessage(`¡Vaquita "${form.name}" creada!`);
      setTimeout(() => router.push(`/vaquita/${newId}`), 1500);
      return;
    }

    try {
      const { signer } = await connectWallet();
      const contract = await getContract(signer);

      const tx = await contract.createGroup(
        form.name.trim(),
        form.description.trim(),
        form.isPublic,
        form.category,
        form.goal ? BigInt(form.goal) : 0n,
        profile.nickname || "Anon"
      );

      setTxMessage("Transacción enviada, esperando confirmación...");
      const receipt = await tx.wait();

      // Obtener ID del evento GroupCreated
      const event = receipt.logs
        .map((log) => { try { return contract.interface.parseLog(log); } catch { return null; } })
        .find((e) => e?.name === "GroupCreated");

      const newId = event ? Number(event.args.groupId) : 1;

      setTxState("success");
      setTxMessage(`¡Vaquita "${form.name}" creada con éxito! 🐄`);
      setTimeout(() => router.push(`/vaquita/${newId}`), 1500);
    } catch (err) {
      setTxState("error");
      setTxMessage(err.reason || err.message || "Error al crear la vaquita");
    }
  }

  return (
    <Layout title="Crear Vaquita ✨">
      <TxModal
        state={txState}
        message={txMessage}
        onClose={() => { if (txState === "error") setTxState("idle"); }}
      />

      <div className="max-w-lg mx-auto">
        <div className="card animate-slide-up">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🐄</div>
            <p className="text-gray-500 text-sm">Completá los datos de tu nueva vaquita</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="label">Nombre de la vaquita *</label>
              <input
                className="input"
                placeholder="Ej: Regalo para el cumple de Sofi 🎁"
                value={form.name}
                onChange={set("name")}
                maxLength={80}
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="label">Descripción</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Contale a todos de qué se trata..."
                value={form.description}
                onChange={set("description")}
                maxLength={200}
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="label">Categoría</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold border-2 transition-all
                      ${form.category === cat
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-transparent bg-gray-50 text-gray-600 hover:border-orange-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibilidad */}
            <div>
              <label className="label">Visibilidad</label>
              <div className="flex gap-3">
                {[
                  { value: true,  label: "🌐 Pública",  desc: "Cualquiera puede solicitar unirse" },
                  { value: false, label: "🔒 Privada",  desc: "Solo por invitación del admin" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, isPublic: opt.value }))}
                    className={`flex-1 p-3 rounded-xl border-2 text-left transition-all
                      ${form.isPublic === opt.value
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                      }`}
                  >
                    <p className="font-semibold text-sm text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <label className="label">Monto objetivo (opcional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-500">VAQ$</span>
                <input
                  className="input pl-14"
                  type="number"
                  placeholder="Ej: 100000"
                  value={form.goal}
                  onChange={set("goal")}
                  min="0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!form.name.trim() || txState === "loading"}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
            >
              🐄 Crear vaquita
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          ⛓️ La creación genera un evento <code>GroupCreated</code> en la blockchain
        </p>
      </div>
    </Layout>
  );
}
