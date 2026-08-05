"use client";

import { useEventStore } from "@/store/eventStore";
import { EventPageView } from "@/components/EventPageView";
import { fontMap } from "@/fonts";

export default function LivePreview() {
  const { event } = useEventStore();

  if (!event || !event.eventId) return null;

  const font = fontMap[event.fontType as keyof typeof fontMap] || "wixMadeforText";

  return (
    <EventPageView
      event={event}
      guest={null}
      editable={true}
    />
  );
}