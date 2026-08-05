"use client";

import { useEffect } from "react";
import { useEventStore } from "@/store/eventStore";
import LivePreview from "./LivePreview";

export default function AdminLayout({ initialEvent }: any) {
  const { setEvent, event, isDirty, reset } = useEventStore();

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  const save = async () => {
    await fetch("/api/organizer/event", {
      method: "PUT",
      body: JSON.stringify(event),
    });

    location.reload();
  };

  return (
    <div className="flex h-screen">
      { /*

      {/* RIGHT */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        <LivePreview />
      </div>
    </div>
  );
}