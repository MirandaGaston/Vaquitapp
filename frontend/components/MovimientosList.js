import { formatAmount, formatDate, categoryEmoji, formatAddress } from "../lib/storage";

function MovRow({ emoji, label, nickname, wallet, amount, isExpense, note, timestamp }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-orange-50 last:border-0 animate-slide-up">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0
        ${isExpense ? "bg-red-100" : "bg-green-100"}`}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-gray-800">{nickname}</span>
          <span className="text-xs text-gray-400">{formatAddress(wallet)}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
            ${isExpense ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
            {label}
          </span>
        </div>
        {note && <p className="text-xs text-gray-500 mt-0.5 truncate">{note}</p>}
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(timestamp)}</p>
      </div>
      <div className={`text-right shrink-0 font-bold ${isExpense ? "text-red-500" : "text-green-600"}`}>
        <span>{isExpense ? "-" : "+"}</span>
        <span className="text-sm">VAQ$ {formatAmount(amount)}</span>
      </div>
    </div>
  );
}

export default function MovimientosList({ contributions, expenses }) {
  // Unir y ordenar por timestamp desc
  const all = [
    ...contributions.map((c) => ({ ...c, type: "contribution" })),
    ...expenses.map((e) => ({ ...e, type: "expense" })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  if (all.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-3xl mb-2">📭</p>
        <p className="text-sm">Todavía no hay movimientos en esta vaquita.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Leyenda blockchain */}
      <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-purple-50 rounded-xl border border-purple-100">
        <span className="text-lg">⛓️</span>
        <p className="text-xs text-purple-700 font-medium">
          Cada movimiento está registrado como un evento en la blockchain de Hardhat. Transparente e inmutable.
        </p>
      </div>

      <div className="divide-y divide-orange-50">
        {all.map((item, i) => {
          if (item.type === "contribution") {
            return (
              <MovRow
                key={`c-${i}`}
                emoji="💚"
                label="Aporte"
                nickname={item.nickname}
                wallet={item.contributor}
                amount={item.amount}
                isExpense={false}
                note={item.note}
                timestamp={item.timestamp}
              />
            );
          } else {
            return (
              <MovRow
                key={`e-${i}`}
                emoji={categoryEmoji(item.category)}
                label={`Gasto · ${item.category}`}
                nickname={item.nickname}
                wallet={item.recorder}
                amount={item.amount}
                isExpense={true}
                note={item.concept}
                timestamp={item.timestamp}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
