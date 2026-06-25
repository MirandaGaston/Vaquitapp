import { formatAddress, formatDate, statusLabel } from "../lib/storage";

export default function MemberList({ members, onApprove, isAdmin, currentAddress }) {
  const approved = members.filter((m) => m.status === 3 || m.status === 2);
  const pending  = members.filter((m) => m.status === 1);

  return (
    <div>
      {/* Miembros aprobados */}
      <div className="space-y-2">
        {approved.map((m) => {
          const rol = statusLabel(m.status);
          return (
            <div key={m.wallet} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-orange-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-yellow-300 flex items-center justify-center text-sm font-bold text-white">
                {m.nickname?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-800">{m.nickname}</span>
                  {m.wallet?.toLowerCase() === currentAddress?.toLowerCase() && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">Vos</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{formatAddress(m.wallet)}</p>
              </div>
              <span className={rol.css}>
                {rol.emoji} {rol.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Solicitudes pendientes (solo admin) */}
      {isAdmin && pending.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-bold text-yellow-700 mb-2 flex items-center gap-1">
            ⏳ Solicitudes pendientes
            <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>
          </h4>
          <div className="space-y-2">
            {pending.map((m) => (
              <div key={m.wallet} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="w-9 h-9 rounded-full bg-yellow-200 flex items-center justify-center text-sm font-bold text-yellow-700">
                  {m.nickname?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">{m.nickname}</p>
                  <p className="text-xs text-gray-400">{formatAddress(m.wallet)}</p>
                </div>
                <button
                  onClick={() => onApprove && onApprove(m.wallet)}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  ✅ Aprobar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {approved.length === 0 && pending.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">Sin miembros todavía.</p>
      )}
    </div>
  );
}
