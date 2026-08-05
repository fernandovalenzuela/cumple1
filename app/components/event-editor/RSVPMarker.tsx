"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useEventStore } from "@/store/eventStore";
import { AccessType } from "@/lib/constants";
import { getRsvpDateInputValue } from "@/lib/rsvp";

import {
  RSVP_ACCESS_TYPES,
  buildRSVPSummary
} from "@/lib/rsvp";

type Props = {
  visible?: boolean;

  topClass?: string;
  leftClass?: string;
};

export default function RSVPMarker({
  visible = true,
  topClass = "top-32",
  leftClass = "left-6",
}: Props) {
  const {
    event,
    updateEvent,
    setActivePanel,
  } = useEventStore();

  const [editing, setEditing] =
    useState(false);

  const [originalValues, setOriginalValues] =
    useState({
      accessType: 3,
      maxGuests: 0,
      askFoodType: false,
      allowMessages: true,
      showMessagesList: true,
      personMaxGuestOpenEvent: 2,
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

  if (!visible || !event)
    return null;

  const handleOpen = () => {
    setOriginalValues({
      accessType:
        event.accessType ?? 3,

      maxGuests:
        event.maxGuests ?? 0,

      askFoodType:
        event.askFoodType ?? false,

      allowMessages:
        event.allowMessages ?? true,

      showMessagesList:
        event.showMessagesList ?? true,

      personMaxGuestOpenEvent:
        event.personMaxGuestOpenEvent ??
        2,
    });

    setActivePanel("rsvp");

    setEditing(true);
  };

  const handleCancel = () => {
    updateEvent(originalValues);

    setActivePanel(null);

    setEditing(false);
  };

  const handleSave = () => {
    setActivePanel(null);

    setEditing(false);
  };

  const summary =
    buildRSVPSummary(event);

  const isOpen = 
    Number(event.accessType) ===
    AccessType.Open;


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
        title="Participación"
        onClick={handleOpen}
        className="
          w-8
          h-8

          rounded-full

          bg-sky-600
          hover:bg-sky-700

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
        📋
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
              max-w-[520px]

              max-h-[85vh]
              overflow-y-auto
            "
          >
            <h2
              className="
                text-xl
                font-semibold
                mb-1
              "
            >
              📋 Configuración sobre invitados
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

              {/* TIPO EVENTO */}
              <div>
                <label className="block mb-1 font-medium">
                  Tipo de evento
                </label>

                <select
                  value={
                    event.accessType ?? 3
                  }
                  onChange={(e) =>
                    updateEvent({
                      accessType:
                        Number(
                          e.target.value
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
                  {RSVP_ACCESS_TYPES.map(
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
                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                >
                  <div><b>Abierto</b>: Los invitados pueden confirmar asistencia.</div> 
                  <div><b>Público</b>: No hay registro de invitados.</div>
                </p>
              </div>

              

              {isOpen ? (
                <>

                  {/* FECHA LIMITE */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Fecha límite para confirmar
                    </label>

                    <input
                      type="date"
                      value={getRsvpDateInputValue(
                        event.eventBirthday,
                        event.rsvpDeadline
                      )}
                      onChange={(e) => {
                        const selectedDate =
                          e.target.value;

                        if (!selectedDate) return;

                        const deadline =
                          new Date(selectedDate);

                        deadline.setHours(
                          23,
                          59,
                          59,
                          0
                        );

                        updateEvent({
                          rsvpDeadline:
                            deadline.toISOString(),
                        });
                      }}
                      className="
                        w-full
                        border
                        rounded
                        p-2
                      "
                    />

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      Día hasta cuando los invitados pueden confirmar asistencia.
                    </p>
                  </div>

                  {/* ACOMPAÑANTES */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Acompañantes permitidos
                    </label>

                    <select
                      value={
                        (event.personMaxGuestOpenEvent ??
                          1) - 1
                      }
                      onChange={(e) =>
                        updateEvent({
                          personMaxGuestOpenEvent:
                            Number(
                              e.target
                                .value
                            ) + 1,
                        })
                      }
                      className="
                        w-full
                        border
                        rounded
                        p-2
                      "
                    >
                      <option value={0}>
                        No permitir acompañantes
                      </option>

                      <option value={1}>
                        1 acompañante
                      </option>

                      <option value={2}>
                        2 acompañantes
                      </option>

                      <option value={3}>
                        3 acompañantes
                      </option>

                      <option value={4}>
                        4 acompañantes
                      </option>
                    </select>
                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      Cantidad de acompañantes que puede llevar un invitado/a.
                    </p>
                  </div>
                  

                  {/* CAPACIDAD */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Capacidad máxima de asistentes
                    </label>

                    <input
                      type="number"
                      placeholder=""
                      min="0"
                      max={event.planMaxGuests}
                      value={
                        event.maxGuests ??
                        ""
                      }
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Si el usuario borra el input, enviamos null o undefined para que no se quede clavado en 0
                        if (inputValue === "") {
                          updateEvent({ maxGuests: undefined });
                          return;
                        }
                        const numValue = Number(inputValue);
                        updateEvent({
                          // Compara el número ingresado con tu límite X y se queda con el menor
                          maxGuests: Math.min(numValue, event.planMaxGuests),
                        });
                      }}
                      className="
                        w-full
                        border
                        rounded
                        p-2
                      "
                    />

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      <div>Cantidad máxima de personas que quieres invitar. Este plan permite hasta: {event.planMaxGuests} personas.</div>
                      
                      <div>Si es superada la cantidad máx. de personas que quieres invitar recibirás una alarma</div>
                    </p>
                  </div>

                  {/* COMIDA */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Solicitar
                      preferencia
                      alimentaria
                    </label>

                    <select
                      value={
                        event.askFoodType
                          ? "1"
                          : "0"
                      }
                      onChange={(e) =>
                        updateEvent({
                          askFoodType:
                            e.target
                              .value ===
                            "1",
                        })
                      }
                      className="
                        w-full
                        border
                        rounded
                        p-2
                      "
                    >
                      <option value="1">
                        Sí
                      </option>

                      <option value="0">
                        No
                      </option>
                    </select>
                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      Sí = Permite que los invitados indiquen comida sin restricciones, vegetariana, vegana o sin gluten.
                    </p>
                  </div>

                  {/* PERMITIR MENSAJES */}
                  <div>
                    <label className="block mb-1 font-medium">
                      Permitir mensajes
                    </label>

                    <select
                      value={
                        event.allowMessages
                          ? "1"
                          : "0"
                      }
                      onChange={(e) =>
                        updateEvent({
                          allowMessages:
                            e.target.value === "1",
                        })
                      }
                      className="
                        w-full
                        border
                        rounded
                        p-2
                      "
                    >
                      <option value="1">
                        Sí
                      </option>

                      <option value="0">
                        No
                      </option>
                    </select>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      Sí = Los visitantes podrán dejar
                      mensajes.
                    </p>
                  </div>

                  {/* MENSAJES */}
                  {/* Animacion: SI event.allowMessages entonces se hace visible con animacion (opacity-100) */}
                  <div
                    className={`
                      overflow-hidden
                      transition-all
                      duration-300
                      ease-in-out

                      ${
                        event.allowMessages
                          ? "max-h-60 opacity-100 mt-3"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div
                      className="
                        ml-4
                        border-l-2
                        border-gray-200
                        pl-4
                        pb-1
                      "
                    >
                      <label className="block mb-1 font-medium">
                        Mostrar mensajes públicamente
                      </label>

                      <select
                        value={
                          event.showMessagesList
                            ? "1"
                            : "0"
                        }
                        onChange={(e) =>
                          updateEvent({
                            showMessagesList:
                              e.target.value === "1",
                          })
                        }
                        className="
                          w-full
                          border
                          rounded
                          p-2
                        "
                      >
                        <option value="1">
                          Sí
                        </option>

                        <option value="0">
                          No
                        </option>
                      </select>

                      <p
                        className="
                          text-xs
                          text-gray-500
                          mt-1
                        "
                      >
                        Mensajes de invitados visibles para
                        todos o sólo para organizador del evento.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="
                    rounded-lg
                    bg-blue-50
                    text-blue-900
                    p-3
                    text-sm
                  "
                >
                  Los visitantes
                  podrán acceder a la
                  información de este evento, pero no
                  podrán confirmar
                  asistencia.
                </div>
              )}

              {/* RESUMEN */}
              { /*
              <div
                className="
                  rounded-lg
                  bg-gray-50
                  border
                  p-3
                "
              >
                <div
                  className="
                    font-semibold
                    mb-2
                  "
                >
                  Vista previa de configuración
                </div>

                <ul
                  className="
                    text-sm
                    space-y-1
                  "
                >
                  {summary.map(
                    (
                      item,
                      index
                    ) => (
                      <li
                        key={
                          index
                        }
                      >
                        • {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
              if (event.allowMessages) {
                summary.push(
                  event.showMessagesList
                    ? "Los mensajes serán públicos."
                    : "Los mensajes solo serán visibles para el organizador."
                );
              } else {
                summary.push(
                  "Los visitantes no podrán dejar mensajes."
                );
              }
              */}
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