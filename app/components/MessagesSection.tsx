"use client";

import { useRef } from "react";

import { Messages } from "./Messages";
import { MessagesList } from "./MessagesList";

type Props = {
  birthdayEventId: number;

  mode: "private" | "open" | "public";

  guest?: any;

  allowMessages?: boolean;

  showMessagesList?: boolean;
};

export function MessagesSection({
  birthdayEventId,
  mode,
  guest,
  allowMessages = true,
  showMessagesList = true,
}: Props) {
  const messagesRef =
    useRef<{
      refresh: () => void;
    }>(null);
//console.log("birthdayEventId",birthdayEventId);
  return (
    <>
      {allowMessages && (
        <Messages
          mode={mode}
          birthdayEventId={birthdayEventId}
          guest={guest}
          onMessageSent={() =>
            messagesRef.current?.refresh()
          }
        />
      )}

      {showMessagesList && (
        <MessagesList
          ref={messagesRef}
          birthdayEventId={birthdayEventId}
        />
      )}
    </>
  );
}