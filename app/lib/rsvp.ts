import { AccessType } from "./../lib/constants";

export type RSVPOption = {
  value: string | number;
  label: string;
};


export const RSVP_ACCESS_TYPES: RSVPOption[] = [
  {
    value: AccessType.Open,
    label: "Abierto",
  },
  {
    value: AccessType.PublicWithoutGuests,
    label: "Público (sin Confirmación Asistencia)",
  },
];

export const RSVP_COMPANIONS: RSVPOption[] = [
  {
    value: 0,
    label: "Sin acompañantes",
  },
  {
    value: 1,
    label: "1 acompañante",
  },
  {
    value: 2,
    label: "2 acompañantes",
  },
  {
    value: 3,
    label: "3 acompañantes",
  },
  {
    value: 4,
    label: "4 acompañantes",
  },
  {
    value: 5,
    label: "5 acompañantes",
  },
];

export function buildRSVPSummary(
  event: any
): string[] {
  const result: string[] = [];

  if (
    event.accessType ===
    AccessType.PublicWithoutGuests
  ) {
    result.push(
      "Evento público sin Confirmación de Asistencia"
    );

    return result;
  }

  result.push("Evento abierto");

  const companions =
    (event.personMaxGuestOpenEvent ??
      1) - 1;

  if (companions === 0) {
    result.push(
      "Los invitados no podrán asistir con acompañantes"
    );
  } else {
    result.push(
      `Cada invitado podrá asistir con hasta ${companions} acompañante(s)`
    );
  }

  if (
    (event.maxGuests ?? 0) === 0
  ) {
    result.push(
      "Sin límite de asistentes"
    );
  } else {
    result.push(
      `Capacidad máxima: ${event.maxGuests} asistentes`
    );
  }

  result.push(
    event.askFoodType
      ? "Se solicitará preferencia tipo de comida"
      : "No se solicitará preferencia tipo de comida"
  );

  result.push(
    event.allowMessages
      ? "Los visitantes podrán dejar mensajes"
      : "Los visitantes no podrán dejar mensajes"
  );

  result.push(
    event.showMessagesList
      ? "Los mensajes serán visibles para todos los visitantes"
      : "Los mensajes serán visibles solo para el organizador"
  );

  return result;
}

export function getDisplayRsvpDeadline(
  eventBirthday?: string | null,
  rsvpDeadline?: string | null
) {
  let date: Date;

  if (rsvpDeadline) {
    date = new Date(rsvpDeadline);
  } else if (eventBirthday) {
    date = new Date(eventBirthday);

    // fallback para eventos viejos
    date.setDate(date.getDate() - 2);
  } else {
    return "";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
    }
  ).format(date);
}


export function getRsvpDateInputValue(
  eventBirthday?: string | null,
  rsvpDeadline?: string | null
) {
  let date: Date;

  /*console.log("@@@@ rsvpDeadline",rsvpDeadline);
  console.log("@@@@ eventBirthday",eventBirthday);*/

  if (rsvpDeadline) {
    date = new Date(rsvpDeadline);
  } else if (eventBirthday) {
    date = new Date(eventBirthday);

    date.setDate(date.getDate() - 2);
  } else {
    return "";
  }
  //console.log("@@@@ date.toISOString",date.toISOString().split("T")[0]);
  return date.toISOString().split("T")[0];
}