import Link from "next/link";
import { formatAmount, categoryEmoji, statusLabel } from "../lib/storage";

export default function VaquitaCard({ group, userStatus }) {
  const pct = group.goal > 0 ? Math.min((group.totalContributed / group.goal) * 100, 100) : null;
  const rol = statusLabel(userStatus);

  return (
    <Link href={`/vaquita/${group.id}`} className="block">
      <div className="card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryEmoji(group.category)}</span>
            <div>
              <h3 className="font-bold text-gray-800 leading-tight group-hover:text-orange-600 transition-colors">
                {group.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{group.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={group.isPublic ? "badge-public" : "badge-private"}>
              {group.isPublic ? "🌐 Pública" : "🔒 Privada"}
            </span>
            <span className={rol.css}>
              {rol.emoji} {rol.label}
            </span>
          </div>
        </div>

        {/* Descripción */}
        {group.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
        )}

        {/* Barra de progreso */}
        {pct !== null && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progreso hacia el objetivo</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center bg-green-50 rounded-xl py-2">
            <p className="text-xs text-green-600 font-medium">Aportado</p>
            <p className="text-sm font-bold text-green-700">VAQ$ {formatAmount(group.totalContributed)}</p>
          </div>
          <div className="text-center bg-red-50 rounded-xl py-2">
            <p className="text-xs text-red-500 font-medium">Gastado</p>
            <p className="text-sm font-bold text-red-600">VAQ$ {formatAmount(group.totalSpent)}</p>
          </div>
          <div className="text-center bg-blue-50 rounded-xl py-2">
            <p className="text-xs text-blue-500 font-medium">Saldo</p>
            <p className="text-sm font-bold text-blue-700">VAQ$ {formatAmount(group.saldo)}</p>
          </div>
        </div>

        {group.goal > 0 && (
          <p className="text-xs text-gray-400 mt-2 text-right">
            Objetivo: VAQ$ {formatAmount(group.goal)}
          </p>
        )}
      </div>
    </Link>
  );
}
