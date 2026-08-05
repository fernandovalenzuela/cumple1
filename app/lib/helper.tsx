import { Status, State } from"./constants";

export function getEventAccessState(row: any) {
  if (row.status === Status.Suspended)
    return { state: State.nok, msg: "Evento suspendido" };

  if (row.status === Status.Cancelled)
    return { state: State.nok, msg: "Evento cancelado" };

  if (row.status < Status.Published)
    return { state: State.nok, msg: "Evento no disponible" };

  if (!row.eventActive)
    return { state: State.nok, msg: "Evento bloqueado temporalmente" };

  return { state: State.ok, msg: null };
}

export function isEventDeadline(row: any) {
    const now = new Date();
    const deadline = row.deadline
    ? new Date(row.deadline)
    : new Date(new Date(row.eventBirthday).getTime() + 86400000);
    return (row.status === Status.Finished || now > deadline);
}

export function entireScreenMessage(msg?: any) {
  const text = msg || "Evento con error";

  return (
    <div className="p-40 text-center text-2xl hero-gradient">
      {text}
    </div>
  );
}

