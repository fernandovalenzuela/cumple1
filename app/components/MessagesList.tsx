"use client";
import {  useEffect,  useState,  useImperativeHandle,  forwardRef,} from "react";
import { formatFriendlyDateTime,} from "@/lib/utils";
import { useEventTypography } from "./TypographyContext";

type Message = {
  id: number;
  name: string;
  message: string;
  response?: string;
  updated_at: string;
};

export const MessagesList = forwardRef( function MessagesList(
      { birthdayEventId, }: { birthdayEventId: number; }, ref ) {
      const typography=useEventTypography();
      const [messages, setMessages] =
        useState<Message[]>([]);

      const fetchMessages =
        async () => {
          const res =
            await fetch(
              `/api/event/messages?birthdayEventId=${birthdayEventId}`
            );
          const data = await res.json();
          setMessages(data);
        };

      useEffect(() => {fetchMessages(); }, [birthdayEventId]);
      useImperativeHandle(
        ref,
        () => ({ refresh: fetchMessages, })
      );

      if ( messages.length === 0 ) {
        return null;
      }

      return (
        <div
          className="
            mt-10
            max-w-md
            mx-auto
            p-5
            rounded-lg
            
            shadow-md
            space-y-4 section-soft
          "
        >
          <div
            className={`${typography.userFontClassName} text-xl text-[var(--color-text-main)] text-left`}>
            Mensajes recientes
          </div>

          {messages.map(
            (msg) => (
              <div
                key={msg.id}
                className="   bg-[var(--color-bg-card)]  p-4 rounded-lg shadow  text-left"
              >
                <div className=" flex justify-between items-center mb-1">
                  <p className="font-black">
                    {msg.name}
                  </p>

                  <p className=" text-xs text-[var(--color-text-muted)]">
                    {formatFriendlyDateTime(
                      msg.updated_at
                    )}
                  </p>
                </div>

                <p className="text-[var(--color-text-soft)]">
                  {msg.message}
                </p>

                {msg.response && (
                  <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                    <div className=" text-sm font-semibold mb-1">
                      Respuesta
                    </div>

                    <p className=" text-sm text-[var(--color-text-soft)]">
                      {msg.response}
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      );
    }
  );