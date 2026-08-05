"use client";

import { useState } from "react";

export default function Page() {
  const [mensaje, setMensaje] = useState("Sin presionar");
  const [log, setLog] = useState("Esperando toque...");

  const ejecutarAccion = () => {
    setLog("Botón tocado - ejecutando setMensaje");
    setMensaje("¡EL BOTÓN FUNCIONA!");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <p className="text-xl font-bold">Estado: {mensaje}</p>
      
      <button
        type="button"
        onClick={ejecutarAccion}
        className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg active:scale-95 transition-transform"
      >
        Probar interacción
      </button>

      {/* Consola visual para debug en celular */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
        Log: {log}
      </div>
    </main>
  );
}