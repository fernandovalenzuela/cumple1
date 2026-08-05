import { sql } from "@/lib/db";
import { EventPageView } from "@/components/EventPageView";
import { Status, AccessType, ImageProcessingStatus, State, RsvpStatus, FoodType } from "../../lib/constants";
import { getEventAccessState, isEventDeadline, entireScreenMessage } from "./../../lib/helper";
import { getBackgroundMotiveProps } from "@/lib/appearance";
import { EVENT_DEFAULTS } from "@/lib/defaults";
import { Event } from "@/lib/types";


/* ==========================================================================
   VARIABLE DE CONTROL: Cambiar a true para usar la base de datos real
   ========================================================================== */
const production = true; 

/* =========================
    PAGE
========================= */

export default async function Page({
  params,
}: {
  params: { slug?: string };
}) {
  const { slug } = await params;

  if (!slug) {
    return entireScreenMessage("Evento inválido");
  }

  let row: any;

  /* ==========================================================================
     MODIFICACIÓN: CONSULTA DE EVENTO / MOCK DATA
     ========================================================================== */
  if (!production) {
    // MOCK DATA: Simula el resultado de data[0] de la consulta SQL
    row = {
      id: 2,
      name: "Juancho P",
      title_1: "Llegaron mis 30!",
      subtitle_1: "Festejo de cumple",
      subtitle_2: "No te lo podés perder",
      eventBirthday: '2026/08/20 18:00:00', // Fecha de hoy
      locationName: "Salón Palermo Soho",
      locationAddress: "Honduras 4800, CABA",
      picture: "/client/people/juan30.jpg",
      locationPicture: "/client/location/salon2.jpg",
      allowMessages: true,
      showMessagesList: true,
      theme: "elegant",
      animationType: 1,
      fontType: "wixMadeforText",
      accessType: AccessType.Open, // Forzamos público para que pase las validaciones del mock
      status: Status.Published,
      deadline: '2026/08/20 23:59:59',
      customerComment: "Traer buena onda",
      eventActive: true,
      backgroundMotive: "soccer_ball",
      personMaxGuestOpenEvent: 2,
      askFoodType: true,
      galleryTitle: "Buenos momentos ✨"
    };
  } else {
    const data = await sql`
      SELECT 
        b.id,
        b.name,
        b.title_1,
        b.subtitle_1,
        b.subtitle_2,
        b."eventBirthday",
        b."locationName",
        b."locationAddress",
        b.picture,
        b."locationPicture",
        b."allowMessages",
        b."showMessagesList",
        b.theme,
        b."animationType",
        b."fontType",
        b."accessType",
        b.status,
        b.deadline,
        b."customerComment",
        b."isActive" as "eventActive",
        b."backgroundMotive",
        b."personMaxGuestOpenEvent",
        b."askFoodType",
        b."galleryTitle",
        b."rsvpDeadline",
        b."maxGuests",
        b."planId",
        b."eventExpiresAt",
        b."occasionType"
      FROM "birthdayEvents" b 
      WHERE b."publicSlug" = ${slug}
    `;
    row = data[0];
  }
  /* ========================================================================== */

  if (!row) {
    return entireScreenMessage("Evento no encontrado");
  }

  /* =========================
      STATUS
  ========================= */

  const eventState = getEventAccessState(row);

  if (eventState.state === State.nok) {
    return <div className="p-20 text-center">{eventState.msg}</div>;
  }

  if (isEventDeadline(row)) {
    return entireScreenMessage("Evento finalizado");  
  }

  /* =========================
      ACCESS
  ========================= */

  if (row.accessType === AccessType.Private) {
    return entireScreenMessage("Este evento es privado");
  }

  /* =========================
      📸 GALERIA (NUEVO)
  ========================= */

  let galleryData: any[];

  /* ==========================================================================
     MODIFICACIÓN: CONSULTA DE GALERÍA / MOCK DATA
     ========================================================================== */
  if (!production) {
    // MOCK DATA: Simula las imágenes de la galería
    galleryData = [
      { id: 101, picture: EVENT_DEFAULTS.picture, thumbnail: null, description: "Foto de prueba 1" },
      { id: 102, picture: EVENT_DEFAULTS.picture, thumbnail: null, description: "Foto de prueba 2" }
    ];
  } else {
    galleryData = await sql`
      SELECT 
        id,
        picture,
        thumbnail,
        description
      FROM "birthdayGallery"
      WHERE "birthdayEventId" = ${row.id}
        AND "isActive" = true
      ORDER BY "position" ASC, id ASC
    `;
  }
  /* ========================================================================== */

  const gallery = galleryData.map((img, index) => ({
    id: img.id,
    picture: img.picture?.startsWith("/") ? img.picture : `/${img.picture}`,
    slot:index+1,
    thumbnail: img.thumbnail
      ? img.thumbnail.startsWith("/")
        ? img.thumbnail
        : `/${img.thumbnail}`
      : null,
      description: img.description,
  }));

  /* =========================
      EVENT
  ========================= */

  const mappedBackgroundMotive = getBackgroundMotiveProps(row.backgroundMotive);

  const event: Event = {
    eventId: row.id,
    occasionType: row.occasionType,
    status: row.status,
    name: row.name,
    title_1: row.title_1,
    subtitle_1: row.subtitle_1,
    subtitle_2: row.subtitle_2,
    eventBirthday: row.eventBirthday,
    /*time: row.eventBirthday.split("T")[1]?.substring(0, 8),*/
    locationName: row.locationName,
    locationAddress: row.locationAddress,
    picture: row.picture?.startsWith("/") ? row.picture : `/${row.picture}`,
    locationPicture: row.locationPicture?.startsWith("/")
      ? row.locationPicture
      : `/${row.locationPicture}`,
    allowMessages: row.allowMessages,
    showMessagesList: row.showMessagesList,
    theme: row.theme || "default",
    animationType: row.animationType,
    fontType: row.fontType || "default",
    customerComment: row.customerComment,
    accessType: row.accessType,
    backgroundMotive: mappedBackgroundMotive,
    askFoodType: row.askFoodType,
    personMaxGuestOpenEvent: row.personMaxGuestOpenEvent,
    gallery,
    galleryTitle: row.galleryTitle,
    rsvpDeadline: row.rsvpDeadline,
    maxGuests: row.maxGuests,
    planMaxGuests:0,
    planId:row.planId,
    eventExpiresAt:row.eventExpiresAt,
  };

  console.log("OPEN-JUANCHO PRODUCCION MODE:", production);

  return (
    <EventPageView
      event={event}
      guest={null}
      editable={false}
    />
  );
}