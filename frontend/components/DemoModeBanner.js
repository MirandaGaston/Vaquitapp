import { setDemoMode } from "../lib/storage";

export default function DemoModeBanner({ onExit }) {
  function handleExit() {
    setDemoMode(false);
    if (onExit) onExit();
    window.location.reload();
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-400 text-yellow-900 px-4 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>🎭</span>
          <span>
            <strong>Modo Demo Activo</strong> — Los datos son de ejemplo. La blockchain no está conectada.
          </span>
        </div>
        <button
          onClick={handleExit}
          className="text-xs bg-yellow-900 text-yellow-100 px-3 py-1 rounded-full font-bold hover:bg-yellow-800 transition-colors whitespace-nowrap"
        >
          Salir del modo demo
        </button>
      </div>
    </div>
  );
}
