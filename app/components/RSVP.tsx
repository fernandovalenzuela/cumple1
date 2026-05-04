"use client"
import { useState } from "react"

export function RSVP() {
  const [name, setName] = useState("")

  return (
    <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
      <input
        placeholder="Tu nombre"
        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
        onChange={(e) => setName(e.target.value)}
      />

      <button className="w-full bg-pink-500 text-white py-3 rounded-lg shadow hover:bg-pink-600 transition">
        Confirmar asistencia
      </button>
    </div>
  )
}