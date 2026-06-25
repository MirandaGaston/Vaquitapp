import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/Layout";
import VaquitaCard from "../components/VaquitaCard";
import DemoModeBanner from "../components/DemoModeBanner";
import { connectWallet, fetchUserGroups, fetchGroup, fetchMemberStatus, getContract } from "../lib/contract";
import { getProfile, isDemoMode } from "../lib/storage";
import { DEMO_GROUPS, DEMO_USER_GROUPS, DEMO_MEMBERS } from "../lib/demoData";

export default function MisVaquitas() {
  const router = useRouter();
  const [groups,    setGroups]    = useState([]);
  const [statuses,  setStatuses]  = useState({});
  const [loading,   setLoading]   = useState(true);
  const [demoMode,  setDemoMode_] = useState(false);
  const [address,   setAddress]   = useState("");
  const [error,     setError]     = useState("");

  useEffect(() => {
    const profile = getProfile();
    if (!profile?.address) { router.replace("/"); return; }
    setAddress(profile.address);

    if (isDemoMode()) {
      setDemoMode_(true);
      loadDemoData(profile.address);
    } else {
      loadBlockchainData(profile.address);
    }
  }, []);

  function loadDemoData(addr) {
    setGroups(DEMO_GROUPS);
    const s = {};
    DEMO_GROUPS.forEach((g) => {
      const m = DEMO_MEMBERS[g.id]?.find(
        (mb) => mb.wallet.toLowerCase() === addr.toLowerCase()
      );
      s[g.id] = m ? m.status : 0;
    });
    setStatuses(s);
    setLoading(false);
  }

  async function loadBlockchainData(addr) {
    setLoading(true);
    setError("");
    try {
      const { signer } = await connectWallet();
      const ids = await fetchUserGroups(addr, signer);

      const groupData = await Promise.all(ids.map((id) => fetchGroup(id, signer)));
      const statusData = await Promise.all(
        ids.map((id) => fetchMemberStatus(id, addr, signer))
      );

      const s = {};
      ids.forEach((id, i) => { s[id] = statusData[i]; });

      setGroups(groupData);
      setStatuses(s);
    } catch (err) {
      setError(err.message);
      // Fallback a demo si hay error de red
      if (err.message.includes("network") || err.message.includes("connect") ||
          err.message.includes("MetaMask") || err.message.includes("ECONNREFUSED")) {
        loadDemoData(addr);
        setDemoMode_(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout title="">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-6xl animate-bounce">🐄</div>
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Cargando tus vaquitas...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {demoMode && <DemoModeBanner />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Mis Vaquitas 🐄</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tus grupos activos</p>
        </div>
        <Link href="/crear" className="btn-primary">
          ✨ Nueva vaquita
        </Link>
      </div>

      {error && !demoMode && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-600">
          <p className="font-semibold">⚠️ Error al conectar con el contrato</p>
          <p className="mt-1 text-xs">{error}</p>
          <p className="mt-2 text-xs text-gray-500">Asegurate de que Hardhat esté corriendo y el contrato esté desplegado.</p>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="card text-center py-16 animate-fade-in">
          <div className="text-6xl mb-4">🐄</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">¡Todavía no tenés vaquitas!</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Creá la primera o esperá que te inviten a una.
          </p>
          <Link href="/crear" className="btn-primary">
            ✨ Crear mi primera vaquita
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((g) => (
            <VaquitaCard key={g.id} group={g} userStatus={statuses[g.id] ?? 0} />
          ))}
        </div>
      )}

      {/* Acceso rápido a vaquitas públicas (para demo) */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="text-sm font-semibold text-blue-700 mb-2">🌐 Explorar vaquitas públicas</p>
        <p className="text-xs text-blue-500">
          Podés solicitar unirte a cualquier vaquita pública. Pedile el ID al creador o explorá desde{" "}
          <span className="font-mono">vaquita/1</span>, <span className="font-mono">vaquita/2</span>, etc.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          {[1, 2, 3].map((id) => (
            <Link
              key={id}
              href={`/vaquita/${id}`}
              className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium"
            >
              Vaquita #{id}
            </Link>
          ))}
        </div>
      </div>

      {demoMode && <div className="pb-16" />}
    </Layout>
  );
}
