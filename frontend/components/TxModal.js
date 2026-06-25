/**
 * Modal de confirmación de transacción.
 * Muestra loading mientras la tx está pendiente y éxito/error al terminar.
 */
export default function TxModal({ state, message, onClose }) {
  // state: "idle" | "loading" | "success" | "error"
  if (state === "idle") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="card max-w-sm w-full animate-bounce-in text-center py-8 px-6">
        {state === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
            <p className="font-bold text-gray-800 text-lg mb-1">Confirmando en blockchain</p>
            <p className="text-sm text-gray-500">{message || "Esperando confirmación de MetaMask..."}</p>
            <p className="text-xs text-purple-500 mt-3">⛓️ Registrando evento en Hardhat local</p>
          </>
        )}

        {state === "success" && (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <p className="font-bold text-green-700 text-lg mb-1">¡Transacción confirmada!</p>
            <p className="text-sm text-gray-500 mb-1">{message}</p>
            <p className="text-xs text-purple-500 mb-5">⛓️ Evento registrado en blockchain</p>
            <button onClick={onClose} className="btn-primary">
              Continuar
            </button>
          </>
        )}

        {state === "error" && (
          <>
            <div className="text-5xl mb-4">😵</div>
            <p className="font-bold text-red-600 text-lg mb-1">Algo salió mal</p>
            <p className="text-sm text-gray-500 mb-5 break-words">{message}</p>
            <button onClick={onClose} className="btn-secondary">
              Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
