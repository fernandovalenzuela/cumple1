"use client";

import { useState } from "react";
import { RsvpStatus } from "@/lib/constants";

type Guest = {
  id: number;
  name: string;
  rsvpStatus: number;
  rsvpMessage?: string;
  peopleLimit: number;
  peopleConfirmed?: number;
  foodType?: number;
};

export default function PrivateRSVP({
  guest,
  askFoodType,
  previewMode
}: {
  guest: Guest;
  askFoodType: boolean;
  previewMode: boolean;
}) {
  const [status, setStatus] = useState<number>(guest.rsvpStatus ?? 0);
  const [message, setMessage] = useState<string>(guest.rsvpMessage ?? "");
  const [people, setPeople] = useState<number>(
    guest.peopleConfirmed ?? guest.peopleLimit ?? 1
  );
  const [foodType, setFoodType] = useState<number>(guest.foodType ?? 0);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (status === 0) {
      setError("Por favor elegí una opción 😊");
      return;
    }

    setError("");
    setLoading(true);

    const res = await fetch("/api/event/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guestId: guest.id,
        rsvpStatus: status,
        rsvpMessage: message,
        peopleConfirmed: status === 1 ? people : 0,
        foodType: askFoodType && status === 1 ? foodType : 0,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  };

  /* =========================
     ✅ CONFIRMACIÓN
  ========================= */

  if (submitted) {
    return (
      <div className="mt-6 text-lg text-center animate-fade-in">
        <p style={{ color: "var(--color-primary)" }}>
          ¡Gracias por confirmar! 💛
        </p>

        {status === 1 && (
          <p className="mt-2" style={{ color: "var(--color-primary)" }}>
            {people === 1
              ? "Te esperamos 🎉"
              : `Los esperamos a los ${people}! 🎉`}
          </p>
        )}

        {status === 2 && (
          <p className="mt-2 text-soft">
            Gracias por avisar 🙌
          </p>
        )}
      </div>
    );
  }

  const showExtraFields =
  previewMode ||
  status === RsvpStatus.Yes;

  return (
    <div className="flex flex-col items-center gap-5 mt-6 w-full animate-fade-in">

      {/* =========================
          OPCIONES
      ========================= */}
      <div className="flex gap-3 flex-wrap justify-center">
        {[
          { label: "Sí, voy 🎉", value: 1 },
          { label: "No puedo 😔", value: 2 },
          { label: "No sé 🤔", value: 3 },
        ].map((option) => {
          const isActive = status === option.value;

          return (
            <button
              key={option.value}
              onClick={() => {
                setStatus(option.value);
                setError("");
              }}
              className="px-5 py-2 rounded-lg transition-all duration-200"
              style={{
                background: isActive
                  ? "var(--color-primary)"
                  : "var(--color-bg-soft)",
                color: isActive
                  ? "white"
                  : "var(--color-text-main)",
                border: `1px solid var(--color-border)`,
                boxShadow: isActive
                  ? "0 0 0 2px rgba(0,0,0,0.05)"
                  : "none",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      )}

      {/* =========================
          PERSONAS
      ========================= */}
      {showExtraFields && guest.peopleLimit > 1 && (
        <div className="w-full max-w-md animate-fade-in">

          <label className="text-sm mb-1 block text-soft">
            ¿Cuántos vienen?
          </label>

          <select
            className="w-full p-3 rounded-xl"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-main)",
              color: "var(--color-text-main)",
            }}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
          >
            {Array.from({ length: guest.peopleLimit }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n === 1 ? "Solo yo" : `${n} personas`}
              </option>
            ))}
          </select>

          <p className="text-xs text-soft mt-1">
            Máximo acompañantes: {guest.peopleLimit} personas
          </p>
        </div>
      )}

      {/* =========================
          COMIDA
      ========================= */}
      {askFoodType && status === 1 && (
        <div className="w-full max-w-md animate-fade-in">
          <label className="text-sm mb-1 block text-soft">
            Preferencia de comida
          </label>

          <select
            className="w-full p-3 rounded-xl"
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-main)",
              color: "var(--color-text-main)",
            }}
            value={foodType}
            onChange={(e) => setFoodType(Number(e.target.value))}
          >
            <option value={0}>Sin restricción</option>
            <option value={1}>Celíaco</option>
            <option value={2}>Vegetariano</option>
            <option value={3}>Vegano</option>
          </select>
        </div>
      )}

      {/* =========================
          MENSAJE
      ========================= */}
      <div className="w-full max-w-md">
        <div className="text-sm mb-1 text-soft">
          ¿Algo para comentarme? 💬
        </div>

        <textarea
          placeholder="Opcional..."
          className="w-full p-3 rounded-xl outline-none transition"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-main)",
            color: "var(--color-text-main)",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* =========================
          BOTÓN
      ========================= */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`main-button ${
          loading ? "main-button-disabled" : "main-button-active"
        }`}
      >
        {loading ? "Guardando..." : "Confirmar asistencia"}
      </button>

    </div>
  );
}