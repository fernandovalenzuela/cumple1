"use client"
import { useState } from "react"

export function Messages() {
  const [msg, setMsg] = useState("")
  const [list, setList] = useState<string[]>([])

  const add = () => {
    if (!msg) return
    setList([...list, msg])
    setMsg("")
  }

  return (
    <div className="max-w-md mx-auto">
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Escribí un mensaje..."
        className="w-full border rounded-lg p-3"
      />

      <button
        onClick={add}
        className="mt-3 bg-pink-500 text-white px-6 py-2 rounded-lg"
      >
        Enviar
      </button>

      <div className="mt-6 space-y-3">
        {list.map((m, i) => (
          <div key={i} className="bg-gray-100 p-3 rounded-lg shadow-sm">
            💬 {m}
          </div>
        ))}
      </div>
    </div>
  )
}