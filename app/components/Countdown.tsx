"use client"
import { useEffect, useState } from "react"

export function Countdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState("00:00:00:00")

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now()

      if (diff <= 0) {
        setTime("00:00:00:00")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      // formato 2 dígitos
      const format = (n: number) => n.toString().padStart(2, "0")

      setTime(`${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="text-center">
	{/* <p className="text-gray-500 mb-2">Faltan</p> */}
      <p className="text-5xl font-bold tracking-widest">
        {time}
      </p>
      <p className="text-2xl mt-2 text-gray-400">
        Días : Horas : Minutos : Segundos
      </p>
    </div>
  )
}