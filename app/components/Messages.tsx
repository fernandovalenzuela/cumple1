"use client";

import { useEffect, useState } from "react";

type Props = {
  mode: "private" | "open" | "public";
  birthdayEventId: number;
  guest?: {
    id: number;
    name: string;
  };
  onMessageSent?: () => void;
};

function getOrCreateAuthorKey(
  birthdayEventId:number
){
  const storageKey=`message_${birthdayEventId}`;
  let authorKey=localStorage.getItem(storageKey);
  if(!authorKey){
    if(typeof crypto!=="undefined" && typeof crypto.randomUUID==="function"){
      authorKey=crypto.randomUUID();
    }else{
      authorKey=`${Date.now()}-${Math.random().toString(36).substring(2,15)}-${Math.random().toString(36).substring(2,15)}`;
    }
    localStorage.setItem( storageKey, authorKey );
  }
  return authorKey;
}

export function Messages({
  mode,
  birthdayEventId,
  guest,
  onMessageSent,
}: Props) {
  const [name, setName] = useState("");
  const [message, setMessage] =  useState("");
  const [response, setResponse] =  useState("");
  const [loading, setLoading] =  useState(false);
  const [loadingInitial, setLoadingInitial] =  useState(true);
  const [saved, setSaved] = useState(false);

  /* =========================
     CARGA INICIAL
  ========================= */

  useEffect(() => { loadMyMessage();}, []);

  const loadMyMessage =
    async () => {
      try {
        let url = "";

        if (mode === "private" ) {
          url = `/api/event/messages/my?mode=private&guestId=${guest?.id}`;
        } else {
          const authorKey = getOrCreateAuthorKey( birthdayEventId);

          url =  `/api/event/messages/my?mode=${mode}&authorKey=${authorKey}`;
        }
        const res =  await fetch(url);
        if (!res.ok) {
          setLoadingInitial( false );
          return;
        }

        const data =await res.json();

        if (data) {
          setName( data.name ?? "");
          setMessage( data.message ??  "");
          setResponse( data.response ??  "");
        }

        if ( mode ===  "private") {
          setName( guest?.name ?? "");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInitial( false);
      }
    };

  /* =========================
     GUARDAR
  ========================= */

  const handleSubmit =
    async () => {
      if ( !message.trim() )
        return;
      if ( mode !== "private" && !name.trim())
        return;

      try {
        setLoading(true);

        let authorKey:
          | string
          | null =
          null;

        let guestId:
          | number
          | null =
          null;

        if (  mode ===  "private") {
          guestId =  guest?.id ?? null;
        } else {
          authorKey = getOrCreateAuthorKey( birthdayEventId );
        }

        const res =
          await fetch(
            "/api/event/messages",
            {
              method: "POST",
              headers: {  "Content-Type":"application/json",
              },

              body:
                JSON.stringify(
                  {
                    mode,
                    birthdayEventId,
                    guestId,
                    authorKey,
                    name: mode ==="private"  ? guest?.name : name,
                    message,
                  }
                ),
            }
          );

        if ( !res.ok ) {
          throw new Error( "Error saving message" );
        }
        setSaved(true);
        onMessageSent?.();
      } catch (error) {
        console.error( error );
      } finally {
        setLoading(false);

        setTimeout(() => {
          setSaved(false );
         }, 2500);
      }
    };

  /* =========================
     LOADING
  ========================= */

  if ( loadingInitial ) {
    return (
      <div className="py-4 text-center text-sm text-gray-500">
        Cargando...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6 max-w-md
            mx-auto">

      {/* =========================
          NOMBRE
      ========================= */}

      {mode !==
        "private" && (
        <input
          type="text"
          maxLength={
            50
          }
          placeholder="Tu nombre"
          value={name}
          onChange={( e ) =>
            setName(  e.target .value )
          }
          className="w-full p-3 rounded-xl outline-none"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-main)",
            color: "var(--color-text-main)",
          }}
        />
      )}

      {/* =========================
          MENSAJE
      ========================= */}

      <textarea
        maxLength={
          500
        }
        placeholder="Tu mensaje..."
        className="w-full p-3 rounded-xl outline-none"
          style={{
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-main)",
            color: "var(--color-text-main)",
          }}
        value={
          message
        }
        onChange={( e) =>
          setMessage( e.target .value  )
        }
      />

      <div className="w-full max-w-md text-right text-xs text-gray-400">
        {
          message.length
        }
        /500
      </div>

      {/* =========================
          RESPUESTA
      ========================= */}

      {response && (
        <div
          className="
            w-full
            max-w-md
            rounded-lg
            bg-[var(--color-bg-soft)]
            border
            border-[var(--color-border)]
            p-4
            mb-3
          "
        >
          <div className="font-semibold mb-2">
            Respuesta
          </div>

          <div>
            {
              response
            }
          </div>
        </div>
      )}

      {/* =========================
          MENSAJE OK
      ========================= */}

      {saved && (
        <div className="text-[var(--color-success)] text-sm">
          Mensaje guardado ✓
        </div>
      )}

      {/* =========================
          BOTÓN
      ========================= */}

      <button
        onClick={
          handleSubmit
        }
        disabled={
          loading ||
          !message.trim() ||
          (mode !==
            "private" &&
            !name.trim())
        }
        className={`main-button ${
          loading ||
          !message.trim() ||
          (mode !==
            "private" &&
            !name.trim())
            ? "main-button-disabled"
            : "main-button-active"
        }`}
      >
        {loading
          ? "Guardando..."
          : "Guardar mensaje"}
      </button>
    </div>
  );
}