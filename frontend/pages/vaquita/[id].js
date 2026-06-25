import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import MemberList from "../../components/MemberList";
import MovimientosList from "../../components/MovimientosList";
import TxModal from "../../components/TxModal";
import DemoModeBanner from "../../components/DemoModeBanner";
import {
  connectWallet, getContract,
  fetchGroup, fetchGroupMembers, fetchGroupContributions, fetchGroupExpenses,
  fetchMemberStatus,
} from "../../lib/contract";
import { getProfile, formatAmount, categoryEmoji, isDemoMode } from "../../lib/storage";
import {
  DEMO_GROUPS, DEMO_MEMBERS, DEMO_CONTRIBUTIONS, DEMO_EXPENSES,
} from "../../lib/demoData";

const EXPENSE_CATEGORIES = ["Regalo", "Comida", "Evento", "Transporte", "Otros"];

// ─── Modales de acción ────────────────────────────────────────────────────────

function ModalAporte({ onClose, onSubmit, loading }) {
  const [amount, setAmount] = useState("");
  const [note,   setNote]   = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="card max-w-sm w-full animate-bounce-in">
        <h3 className="text-lg font-extrabold text-gray-800 mb-4">💚 Cargar Aporte</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Monto (VAQ$) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-500">VAQ$</span>
              <input
                className="input pl-14"
                type="number"
                placeholder="Ej: 30000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="label">Nota (opcional)</label>
            <input className="input" placeholder="Ej: Mi parte 💜" value={note} onChange={(e) => setNote(e.target.value)} maxLength={100} />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center" disabled={loading}>Cancelar</button>
            <button
              onClick={() => onSubmit(amount, note)}
              disabled={!amount || Number(amount) <= 0 || loading}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {loading ? <><div className="spinner" /> Enviando...</> : "Confirmar →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalGasto({ onClose, onSubmit, loading }) {
  const [amount,   setAmount]   = useState("");
  const [concept,  setConcept]  = useState("");
  const [category, setCategory] = useState("Regalo");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="card max-w-sm w-full animate-bounce-in">
        <h3 className="text-lg font-extrabold text-gray-800 mb-4">💸 Cargar Gasto</h3>
        <div className="space-y-4">
          <div>
            <label className="label">Concepto *</label>
            <input className="input" placeholder="Ej: Compra del regalo" value={concept} onChange={(e) => setConcept(e.target.value)} maxLength={100} autoFocus />
          </div>
          <div>
            <label className="label">Monto (VAQ$) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-orange-500">VAQ$</span>
              <input className="input pl-14" type="number" placeholder="Ej: 55000" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" />
            </div>
          </div>
          <div>
            <label className="label">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                    ${category === c ? "border-orange-400 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-orange-200"}`}
                >
                  {categoryEmoji(c)} {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center" disabled={loading}>Cancelar</button>
            <button
              onClick={() => onSubmit(amount, concept, category)}
              disabled={!amount || !concept || Number(amount) <= 0 || loading}
              className="btn-primary flex-1 justify-center disabled:opacity-60"
            >
              {loading ? <><div className="spinner" /> Enviando...</> : "Confirmar →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function VaquitaDetalle() {
  const router = useRouter();
  const { id }  = router.query;

  const [group,         setGroup]         = useState(null);
  const [members,       setMembers]       = useState([]);
  const [contributions, setContribs]      = useState([]);
  const [expenses,      setExpenses]      = useState([]);
  const [userStatus,    setUserStatus]    = useState(0);
  const [profile,       setProfile]       = useState(null);
  const [signer,        setSigner]        = useState(null);
  const [contract,      setContract]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [demoMode,      setDemoMode_]     = useState(false);
  const [error,         setError]         = useState("");

  // Modales
  const [showAporte,    setShowAporte]    = useState(false);
  const [showGasto,     setShowGasto]     = useState(false);
  const [txLoading,     setTxLoading]     = useState(false);
  const [txState,       setTxState]       = useState("idle");
  const [txMessage,     setTxMessage]     = useState("");

  // ─── Carga de datos ──────────────────────────────────────────────────────────

  const loadData = useCallback(async (groupId) => {
    const p = getProfile();
    if (!p?.address) { router.replace("/"); return; }
    setProfile(p);

    if (isDemoMode()) {
      setDemoMode_(true);
      loadDemoData(groupId, p.address);
      return;
    }

    try {
      const { signer: s } = await connectWallet();
      const c = await getContract(s);
      setSigner(s);
      setContract(c);

      const [g, mems, contribs, exps, status] = await Promise.all([
        fetchGroup(groupId, s),
        fetchGroupMembers(groupId, s),
        fetchGroupContributions(groupId, s),
        fetchGroupExpenses(groupId, s),
        fetchMemberStatus(groupId, p.address, s),
      ]);

      setGroup(g);
      setMembers(mems);
      setContribs(contribs);
      setExpenses(exps);
      setUserStatus(status);
    } catch (err) {
      if (err.message?.includes("Vaquita no existe")) {
        setError("Esta vaquita no existe en la blockchain.");
      } else {
        setError(err.message);
        setDemoMode_(true);
        loadDemoData(groupId, p.address);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function loadDemoData(groupId, addr) {
    const gid = Number(groupId);
    const g = DEMO_GROUPS.find((x) => x.id === gid);
    if (g) {
      setGroup(g);
      setMembers(DEMO_MEMBERS[gid] || []);
      setContribs(DEMO_CONTRIBUTIONS[gid] || []);
      setExpenses(DEMO_EXPENSES[gid] || []);
      const m = (DEMO_MEMBERS[gid] || []).find(
        (mb) => mb.wallet.toLowerCase() === addr.toLowerCase()
      );
      setUserStatus(m ? m.status : 0);
    } else {
      setError("Vaquita no encontrada en el modo demo.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  // ─── Acciones ────────────────────────────────────────────────────────────────

  async function handleSolicitud() {
    if (demoMode) {
      setTxState("loading");
      setTxMessage("Enviando solicitud de ingreso...");
      await sleep(1500);
      setUserStatus(1);
      setMembers((prev) => [
        ...prev,
        { wallet: profile.address, nickname: profile.nickname, status: 1, joinedAt: 0 },
      ]);
      setTxState("success");
      setTxMessage("¡Solicitud enviada! El admin tiene que aprobarte.");
      return;
    }
    try {
      setTxState("loading");
      setTxMessage("Enviando solicitud...");
      const tx = await contract.requestToJoinGroup(id, profile.nickname || "Anon");
      await tx.wait();
      setTxState("success");
      setTxMessage("¡Solicitud enviada! Esperá que el admin te apruebe.");
      await loadData(id);
    } catch (err) {
      setTxState("error");
      setTxMessage(err.reason || err.message);
    }
  }

  async function handleApprove(memberWallet) {
    if (demoMode) {
      setTxState("loading");
      setTxMessage("Aprobando miembro...");
      await sleep(1500);
      setMembers((prev) =>
        prev.map((m) =>
          m.wallet === memberWallet ? { ...m, status: 2, joinedAt: Date.now() / 1000 } : m
        )
      );
      setTxState("success");
      setTxMessage("¡Miembro aprobado! Ya puede aportar.");
      return;
    }
    try {
      setTxState("loading");
      setTxMessage("Aprobando miembro en blockchain...");
      const tx = await contract.approveMember(id, memberWallet);
      await tx.wait();
      setTxState("success");
      setTxMessage("¡Miembro aprobado exitosamente! ✅");
      await loadData(id);
    } catch (err) {
      setTxState("error");
      setTxMessage(err.reason || err.message);
    }
  }

  async function handleAporte(amount, note) {
    setShowAporte(false);
    if (demoMode) {
      setTxState("loading");
      setTxMessage("Registrando aporte en blockchain...");
      await sleep(2000);
      const newC = {
        id: contributions.length,
        contributor: profile.address,
        nickname: profile.nickname,
        amount: Number(amount),
        note,
        timestamp: Math.floor(Date.now() / 1000),
      };
      setContribs((prev) => [...prev, newC]);
      setGroup((prev) => ({
        ...prev,
        totalContributed: prev.totalContributed + Number(amount),
        saldo:            prev.saldo + Number(amount),
      }));
      setTxState("success");
      setTxMessage(`Aporte de VAQ$ ${formatAmount(amount)} registrado en blockchain 🎉`);
      return;
    }
    try {
      setTxState("loading");
      setTxMessage("Registrando aporte...");
      const tx = await contract.addContribution(
        id, BigInt(amount), note, profile.nickname || "Anon"
      );
      setTxMessage("Esperando confirmación...");
      await tx.wait();
      setTxState("success");
      setTxMessage(`¡Aporte de VAQ$ ${formatAmount(amount)} confirmado! 💚`);
      await loadData(id);
    } catch (err) {
      setTxState("error");
      setTxMessage(err.reason || err.message);
    }
  }

  async function handleGasto(amount, concept, category) {
    setShowGasto(false);
    if (demoMode) {
      setTxState("loading");
      setTxMessage("Registrando gasto en blockchain...");
      await sleep(2000);
      const newE = {
        id: expenses.length,
        recorder: profile.address,
        nickname: profile.nickname,
        amount: Number(amount),
        concept,
        category,
        timestamp: Math.floor(Date.now() / 1000),
      };
      setExpenses((prev) => [...prev, newE]);
      setGroup((prev) => ({
        ...prev,
        totalSpent: prev.totalSpent + Number(amount),
        saldo:      prev.saldo - Number(amount),
      }));
      setTxState("success");
      setTxMessage(`Gasto de VAQ$ ${formatAmount(amount)} registrado en blockchain 💸`);
      return;
    }
    try {
      setTxState("loading");
      setTxMessage("Registrando gasto...");
      const tx = await contract.addExpense(
        id, BigInt(amount), concept, category, profile.nickname || "Anon"
      );
      setTxMessage("Esperando confirmación...");
      await tx.wait();
      setTxState("success");
      setTxMessage(`¡Gasto de VAQ$ ${formatAmount(amount)} confirmado! 💸`);
      await loadData(id);
    } catch (err) {
      setTxState("error");
      setTxMessage(err.reason || err.message);
    }
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-6xl animate-bounce">🐄</div>
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Cargando vaquita...</p>
        </div>
      </Layout>
    );
  }

  if (error && !group) {
    return (
      <Layout title="Error">
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-red-500 font-semibold">{error}</p>
          <button onClick={() => router.push("/mis-vaquitas")} className="btn-secondary mt-4">
            ← Volver
          </button>
        </div>
      </Layout>
    );
  }

  const isAdmin    = userStatus === 3;
  const isMember   = userStatus === 2 || userStatus === 3;
  const isPending  = userStatus === 1;
  const isStranger = userStatus === 0;

  const pct = group.goal > 0
    ? Math.min((group.totalContributed / group.goal) * 100, 100)
    : null;

  const pendingMembers = members.filter((m) => m.status === 1);

  return (
    <Layout>
      {demoMode && <DemoModeBanner />}

      {/* Modales de acción */}
      {showAporte && <ModalAporte onClose={() => setShowAporte(false)} onSubmit={handleAporte} loading={txLoading} />}
      {showGasto  && <ModalGasto  onClose={() => setShowGasto(false)}  onSubmit={handleGasto}  loading={txLoading} />}
      <TxModal
        state={txState}
        message={txMessage}
        onClose={() => setTxState("idle")}
      />

      <div className="max-w-2xl mx-auto space-y-5 pb-20">
        {/* ─── Header ─────────────────────────────────────── */}
        <div className="card animate-fade-in">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-4xl">{categoryEmoji(group.category)}</span>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-gray-800 leading-tight">{group.name}</h1>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="text-xs text-gray-400">{group.category}</span>
                <span className={group.isPublic ? "badge-public" : "badge-private"}>
                  {group.isPublic ? "🌐 Pública" : "🔒 Privada"}
                </span>
                {isAdmin   && <span className="badge-admin">👑 Admin</span>}
                {!isAdmin && isMember  && <span className="badge-member">✅ Miembro</span>}
                {isPending && <span className="badge-pending">⏳ Pendiente</span>}
              </div>
            </div>
          </div>

          {group.description && (
            <p className="text-sm text-gray-600 mb-4">{group.description}</p>
          )}

          {/* Barra de progreso */}
          {pct !== null && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progreso (VAQ$ {formatAmount(group.totalContributed)} / {formatAmount(group.goal)})</span>
                <span className="font-bold text-orange-500">{Math.round(pct)}%</span>
              </div>
              <div className="h-3 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-green-50 rounded-xl py-3">
              <p className="text-xs text-green-600 font-medium mb-0.5">💚 Aportado</p>
              <p className="text-lg font-extrabold text-green-700">VAQ$ {formatAmount(group.totalContributed)}</p>
            </div>
            <div className="text-center bg-red-50 rounded-xl py-3">
              <p className="text-xs text-red-500 font-medium mb-0.5">💸 Gastado</p>
              <p className="text-lg font-extrabold text-red-600">VAQ$ {formatAmount(group.totalSpent)}</p>
            </div>
            <div className="text-center bg-blue-50 rounded-xl py-3">
              <p className="text-xs text-blue-500 font-medium mb-0.5">💰 Saldo</p>
              <p className="text-lg font-extrabold text-blue-700">VAQ$ {formatAmount(group.saldo)}</p>
            </div>
          </div>
        </div>

        {/* ─── Notificación pendiente ──────────────────────── */}
        {isAdmin && pendingMembers.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl animate-fade-in">
            <span className="text-xl">⏳</span>
            <p className="text-sm text-yellow-800 font-medium">
              Tenés <strong>{pendingMembers.length}</strong> solicitud{pendingMembers.length > 1 ? "es" : ""} pendiente{pendingMembers.length > 1 ? "s" : ""} de aprobación
            </p>
          </div>
        )}

        {/* ─── Acciones ────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          {isMember && (
            <button onClick={() => setShowAporte(true)} className="btn-primary">
              💚 Aportar
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setShowGasto(true)} className="btn-secondary">
              💸 Cargar gasto
            </button>
          )}
          {isStranger && (
            <button onClick={handleSolicitud} className="btn-primary">
              🙋 Solicitar unirme
            </button>
          )}
          {isPending && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
              ⏳ Solicitud enviada — esperando aprobación
            </div>
          )}
        </div>

        {/* ─── Miembros ────────────────────────────────────── */}
        <div className="card">
          <h2 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            👥 Miembros
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
              {members.filter((m) => m.status >= 2).length}
            </span>
          </h2>
          <MemberList
            members={members}
            onApprove={handleApprove}
            isAdmin={isAdmin}
            currentAddress={profile?.address}
          />
        </div>

        {/* ─── Historial blockchain ─────────────────────────── */}
        <div className="card">
          <h2 className="font-extrabold text-gray-800 mb-4">📜 Historial Transparente</h2>
          <MovimientosList contributions={contributions} expenses={expenses} />
        </div>

        {/* ─── Info técnica para la demo ────────────────────── */}
        <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
          <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
            ⛓️ Registros en Blockchain
          </h3>
          <div className="space-y-1.5 text-xs text-purple-700">
            <p>• Cada acción emite un evento inmutable en el contrato <code className="bg-purple-100 px-1 rounded">Vaquitapp.sol</code></p>
            <p>• Los eventos son: <code className="bg-purple-100 px-1 rounded">GroupCreated</code>, <code className="bg-purple-100 px-1 rounded">ContributionAdded</code>, <code className="bg-purple-100 px-1 rounded">ExpenseAdded</code></p>
            <p>• Red: <strong>Hardhat Local (chainId 1337)</strong> · Montos ficticios en VAQ$</p>
            <p>• Vaquita ID: <strong>#{id}</strong> · Admin: <code className="bg-purple-100 px-1 rounded">{group.admin?.slice(0,10)}...</code></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
