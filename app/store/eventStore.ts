"use client";

import { create } from "zustand";
import { DEFAULT_EVENT} from "@/lib/defaults";
import type { Event } from "@/lib/types";


/* =========================
   🧠 NORMALIZADOR
========================= */

function normalizeEvent(event: Event | null): Event {
  return {
    ...DEFAULT_EVENT,
    ...(event || {})
  };
}

/* =========================
   🏪 STORE
========================= */

type EventState = {
  event: Event | null;
  originalEvent: Event | null;
  pendingFiles: Record<string, File>;
  pendingGalleryFiles:Record<string,File>;
  isDirty: boolean;
  activePanel: string | null;
  activeEditMarker: string | null;
  /* ACTIONS */
  setEvent: (event: Event) => void;
  updateEvent: (patch: Partial<Event>) => void;
  resetEvent: () => void;
  reset: () => void; // alias
  markSaved: () => void;
  setPendingFile: (
    field: string,
    file: File
  ) => void;
  setActivePanel: (
    panel: string | null
  ) => void;
  setActiveEditMarker: (
    marker: string | null
  ) => void;
  setPendingGalleryFile:(
    id:string,
    file:File
  )=>void;
  clearPendingFiles:()=>void;
  clearPendingGalleryFiles:()=>void;
};

export const useEventStore = create<EventState>((set, get) => ({
  event: null,
  originalEvent: null,
  isDirty: false,
  pendingFiles: {},
  pendingGalleryFiles:{},
  activePanel: null,
  activeEditMarker: null,

  /* =========================
     INIT
  ========================= */
  setEvent: (event) => {
    const normalized = normalizeEvent(event);

    set({
      event: normalized,
      originalEvent: normalized,
      isDirty: false,
    });
  },

  /* =========================
     UPDATE
  ========================= */
  updateEvent: (patch) => {
    //console.log("PATCH", patch);
    const current = get().event;
    if (!current) return;

    const updated = {
      ...current,
      ...patch,
    };

    set({
      event: updated,
      isDirty: true,
    });
  },

  /* =========================
     RESET
  ========================= */
  resetEvent: () => {
    const original = get().originalEvent;
    if (!original) return;

    set({
      event: { ...original },
      isDirty: false,
    });
  },

  /* 🔥 COMPATIBILIDAD */
  reset: () => {
    const original = get().originalEvent;
    if (!original) return;

    set({
      event: { ...original },
      isDirty: false,
    });
  },

  /* =========================
     SAVE OK
  ========================= */
  markSaved: () => {
    const current=get().event;
    if(!current)
      return;
    set({
      originalEvent:{
        ...current,
        gallery:(current.gallery??[])
          .filter(item=>item.status!=="deleted")
          .map(item=>({...item,status:"unchanged", })),
      },
      event:{
        ...current,
        gallery:(current.gallery??[])
          .filter(item=>item.status!=="deleted").map(item=>({...item,status:"unchanged", })),
      },
      isDirty:false,
    });
  },

  setPendingFile: (field, file) => {
    set((state) => ({
      pendingFiles: {
        ...state.pendingFiles,
        [field]: file,
      },
    }));
  },

  setPendingGalleryFile:(id,file)=>{
    set(state=>({
      pendingGalleryFiles:{
        ...state.pendingGalleryFiles,
        [id]:file,
      },
    }));
  },

  setActivePanel: (panel) => {
    set({
      activePanel: panel,
    });
  },

  setActiveEditMarker: (
    marker
  ) => {
    set({
      activeEditMarker:
        marker,
    });
  },

  clearPendingFiles:()=>{
    set({
      pendingFiles:{},
    });
  },

  clearPendingGalleryFiles:()=>{
    set({
      pendingGalleryFiles:{},
    });
  },

}));