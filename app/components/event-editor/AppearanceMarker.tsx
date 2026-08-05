"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useEventStore } from "@/store/eventStore";

import {
  APPEARANCE_THEMES,
  APPEARANCE_FONTS,
  APPEARANCE_ANIMATIONS,
  APPEARANCE_BACKGROUNDS,
} from "@/lib/appearance";

type Props = {
  visible?: boolean;

  topClass?: string;
  leftClass?: string;
};

export default function AppearanceMarker({
  visible = true,
  topClass = "top-6",
  leftClass = "left-6",
}: Props) {
  

  const {
    event,
    updateEvent,
    setActivePanel,
    } = useEventStore();

    //console.log("event", event);


  const [editing, setEditing] =
    useState(false);

  const [originalAppearance, setOriginalAppearance] =
    useState({
      theme: "",
      fontType: "",
      animationType: 0,
      backgroundMotive: "",
    });

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing) return;

    function handleClickOutside(
      e: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          e.target as Node
        )
      ) {
        handleCancel();
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, [editing]);

  if (!visible || !event) return null;

  const handleOpen = () => {
    setOriginalAppearance({
      theme: event.theme ?? "elegant",
      fontType:
        event.fontType ??
        "wixMadeforText",
      animationType:
        event.animationType ?? 0,
      backgroundMotive:
        event.backgroundMotive ??
        "heart",
    });

    setActivePanel("appearance");

    setEditing(true);
  };

  const handleCancel = () => {
    updateEvent(originalAppearance);
    setActivePanel(null);
    setEditing(false);
  };

  const handleSave = () => {
    setActivePanel(null);
    setEditing(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`
        absolute
        ${topClass}
        ${leftClass}
        z-[999]
      `}
    >
      <button
        type="button"
        title="Apariencia"
        onClick={handleOpen}
        className="
          w-8
          h-8

          rounded-full
          bg-violet-600
          hover:bg-violet-700
          text-white

          flex
          items-center
          justify-center

          shadow-lg
          animate-pulse

          hover:scale-105
          transition
        "
      >
        🎨
      </button>

      {editing && (
        <div
          className="
            fixed
            inset-0
            z-[1000]

            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-black/20
            "
          />

          <div
            className="
              relative
              font-sans
              bg-white
              rounded-xl
              shadow-2xl

              p-5

              w-[95%]
              max-w-[500px]
            "
          >
            <h2
              className="
                text-xl
                font-semibold
                mb-1
              "
            >
              🎨 Apariencia del evento
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mb-5
              "
            >
              Los cambios se muestran
              en tiempo real
            </p>

            <div className="space-y-4">
              {/* THEME */}
              <div>
                <label className="block mb-1 font-medium">
                  Tema
                </label>

                <select
                  value={event.theme ?? ""}
                  onChange={(e) =>
                    updateEvent({
                      theme:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                >
                  {APPEARANCE_THEMES.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* FONT */}
              <div>
                <label className="block mb-1 font-medium">
                  Fuente tipógrafica
                </label>

                <select
                  value={
                    event.fontType ??
                    ""
                  }
                  onChange={(e) =>
                    updateEvent({
                      fontType:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                >
                  {APPEARANCE_FONTS.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ANIMATION */}
              <div>
                <label className="block mb-1 font-medium">
                  Animación
                </label>

                <select
                  value={
                    event.animationType ??
                    0
                  }
                  onChange={(e) =>
                    updateEvent({
                      animationType:
                        Number(
                          e.target
                            .value
                        ),
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                >
                  {APPEARANCE_ANIMATIONS.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* BACKGROUND */}
              <div>
                <label className="block mb-1 font-medium">
                  Fondo
                </label>

                <select
                  value={
                    event.backgroundMotive ??
                    ""
                  }
                  onChange={(e) =>
                    updateEvent({
                      backgroundMotive:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    border
                    rounded
                    p-2
                  "
                >
                  {APPEARANCE_BACKGROUNDS.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div
              className="
                flex
                justify-end
                gap-4
                pt-5
              "
            >
              <button
                type="button"
                onClick={handleSave}
                className="
                  text-green-600
                  font-bold
                  text-xl
                  pr-4
                "
              >  
                ✓
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="
                  text-red-600
                  font-bold
                  text-xl
                "
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}