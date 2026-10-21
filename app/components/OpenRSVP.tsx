"use client";

import { useEffect, useState } from "react";
import { RsvpStatus } from "../lib/constants";

type Props = {
  eventId: number;
};

type RSVPData = {
  id?: string;
  name: string;
  phone: string;
  message: string;
  foodType: number;
  rsvpStatus: number;
  people: number;
};

/* =========================
   🔐 CONFIG
========================= */

const PREFIX = "X9pL2";
const SUFFIX = "K7mQ4";

/* =========================
   🔐 ENCRYPT / DECRYPT
========================= */

function encryptId(id: number): string {
  const base = btoa(id.toString());
  return `${PREFIX}${base}${SUFFIX}`;
}

function decryptId(encoded: string): number | null {
  try {
    if (!encoded.startsWith(PREFIX) || !encoded.endsWith(SUFFIX)) {
      return null;
    }

    const base = encoded.slice(PREFIX.length, -SUFFIX.length);
    return parseInt(atob(base));
  } catch {
    return null;
  }
}

export  default function OpenRSVP({ eventId, maxPeople, askFoodType, previewMode }: {eventId?: number, maxPeople: number, askFoodType: boolean, previewMode: boolean}) {
  const [form, setForm] = useState<RSVPData>({
    name: "",
    phone: "",
    message: "",
    foodType: 0,
    rsvpStatus: 0,
    people: 1,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     🔹 LOAD COOKIE
  ========================= */

  useEffect(() => {
    const saved = localStorage.getItem(`rsvp_${eventId}`);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(parsed);
        setIsEditing(true);
      } catch {
        console.error("Error parsing RSVP cookie");
      }
    }
  }, [eventId]);

  /* =========================
     🔹 HANDLE CHANGE
  ========================= */

  const handleChange = (field: keyof RSVPData, value: any) => {
    
    console.log("maxPeople", maxPeople);
    console.log("askFoodType",askFoodType);
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================
     🔹 SUBMIT
  ========================= */

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const decodedId = form.id ? decryptId(form.id) : null;

    try {
      const res = await fetch("/api/event/open-rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: decodedId,
          name: form.name,
          phone: form.phone,
          message: form.message,
          foodType: form.foodType,
          rsvpStatus: form.rsvpStatus,
          people: form.people,
          birthdayEventId: eventId,
        }),
      });

      if (res.status === 429) {
        setError("Demasiados intentos. Intenta en unos minutos.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError("Error al guardar");
        setLoading(false);
        return;
      }

      const encryptedId = encryptId(data.id);

      const toSave: RSVPData = {
        ...form,
        id: encryptedId,
      };

      localStorage.setItem(`rsvp_${eventId}`, JSON.stringify(toSave));

      setSubmitted(true);
      setIsEditing(true);
    } catch (err) {
      setError("Error inesperado");
    }

    setLoading(false);
  };

  /* =========================
     ✅ SUCCESS
  ========================= */

  if (submitted) {
    return (
      <div className="text-center mt-6">
        <p style={{ color: "var(--color-primary)" }}>
          {isEditing
            ? "Gracias, tu respuesta fue enviada 👍"
            : "Gracias por confirmar! 🎉"}
        </p>
      </div>
    );
  }

  /* =========================
     🚫 ERROR
  ========================= */

  if (error) {
    return (
      <div className="text-center mt-6">
        <p className="text-[var(--color-error)]">{error}</p>
      </div>
    );
  }

  /* =========================
     🧾 FORM
  ========================= */

  const showExtraFields =
    previewMode ||
    form.rsvpStatus === RsvpStatus.Yes;

  return (
    <div className="flex flex-col items-center gap-6 mt-6 w-full max-w-md mx-auto ">

      {isEditing && (
        <p className="text-sm text-soft text-center">
          Ya habías respondido. Puedes modificar tu respuesta.
        </p>
      )}

      {/* NAME */}
      <div className="w-full">
        <label className="text-sm mb-1 block text-soft">Nombre</label>
        <input
          placeholder="Tu nombre completo"
          className="w-full p-3 rounded-xl outline-none"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-main)",
            color: "var(--color-text-main)",
          }}
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* PHONE */}
      <div className="w-full">
        <label className="text-sm mb-1 block text-soft">WhatsApp</label>
        <input
          placeholder="Ej: 1112345678"
          className="w-full p-3 rounded-xl outline-none"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-main)",
            color: "var(--color-text-main)",
          }}
          value={form.phone}
          onChange={(e) =>
            handleChange("phone", e.target.value.replace(/\D/g, ""))
          }
        />
      </div>

      {/* RSVP */}
      <div className="w-full text-center">
        <label className="text-sm mb-2 block text-soft">
          ¿Vas a asistir?
        </label>

        <div className="flex gap-3 justify-center">
          {[1, 2, 3].map((value) => {
            const isActive = form.rsvpStatus === value;

            return (
              <button
                key={value}
                onClick={() => handleChange("rsvpStatus", value)}
                className="px-5 py-2 rounded-xl transition"
                style={{
                  background: isActive
                    ? "var(--color-primary)"
                    : "var(--color-bg-soft)",
                  color: isActive
                    ? "var(--color-text-on-primary)"
                    : "var(--color-text-main)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {value === 1 ? "Sí" : value === 2 ? "No" : "No sé"}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONDITIONAL */}
      {showExtraFields && (
        <>
          {/* PEOPLE */}
          <div className="w-full">

            {maxPeople === 1 ? (
              <div
                className="w-full p-3 rounded-xl text-center"
                style={{
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-soft)",
                  color: "var(--color-text-main)",
                }}
              >
                Esta invitación es personal — válida para 1 persona, sin acompañantes 💌
              </div>
            ) : (
              <>
                <label className="text-sm mb-1 block text-soft">
                  ¿Cuántas personas?
                </label>

                <select
                  className="w-full p-3 rounded-xl"
                  style={{
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-main)",
                    color: "var(--color-text-main)",
                  }}
                  value={form.people}
                  onChange={(e) =>
                    handleChange("people", Number(e.target.value))
                  }
                >
                  {Array.from({ length: maxPeople }, (_, i) => {
                    const n = i + 1;

                    let label = "";
                    if (n === 1) label = "Solo yo";
                    else if (n === 2) label = "Yo + 1 persona";
                    else label = `Yo + ${n-1} personas`;

                    return (
                      <option key={n} value={n}>
                        {label}
                      </option>
                    );
                  })}
                </select>

                <p className="text-xs text-soft mt-1">
                  Máximo permitido: {maxPeople}
                </p>
              </>
            )}

          </div>

          {/* FOOD */}
          {askFoodType && (
          <>  
          <div className="w-full">
            <label className="text-sm mb-1 block text-soft">Comida</label>
            <select
              className="w-full p-3 rounded-xl"
              style={{
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-main)",
                color: "var(--color-text-main)",
              }}
              value={form.foodType}
              onChange={(e) =>
                handleChange("foodType", Number(e.target.value))
              }
            >
              <option value={0}>Sin restricción</option>
              <option value={1}>Celíaco</option>
              <option value={2}>Vegetariano</option>
              <option value={3}>Vegano</option>
            </select>
          </div>
          </>
          )}

        
      
        </>
      )}

      {/* MESSAGE */}
      <div className="w-full">
        <label className="text-sm mb-1 block text-soft">Comentario</label>
        <textarea
          placeholder="¿Algo para comentarme?"
          className="w-full p-3 rounded-xl min-h-[50px]"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-main)",
            color: "var(--color-text-main)",
          }}
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.name || !form.phone}
        className={`main-button ${
          loading || !form.name || !form.phone
            ? "main-button-disabled"
            : "main-button-active"
        }`}
      >
        {loading
          ? "Enviando..."
          : isEditing
          ? "Actualizar respuesta"
          : "Confirmar asistencia"}
      </button>
    </div>
  );
}