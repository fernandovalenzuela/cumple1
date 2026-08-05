import { sql } from "@/lib/db";
import { EventPageView } from "@/components/EventPageView";
import { Status, AccessType, ImageProcessingStatus, State, RsvpStatus, FoodType } from "../../lib/constants";
import { getEventAccessState, isEventDeadline, entireScreenMessage } from "./../../lib/helper";
import { getBackgroundMotiveProps } from "@/lib/appearance";
import { Event } from "@/lib/types";


/* =========================
   PAGE
========================= */

export default async function Page({ params }: { params: { code?: string } }) {

  const { code } = await params;

  if (!code) {
    return entireScreenMessage("Invitación inválida");
  }

  const data = await sql`
    SELECT 
      g.id as guest_id,
      g.name as guest_name,
      g.code,
      g."foodType",
      g."rsvpStatus",
      g."rsvpMessage",
      g."peopleLimit",
      g."peopleConfirmed",
      g."isActive" as "guestActive",

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
      b."askFoodType",
      b."galleryTitle",
      b."rsvpDeadline",
      b."maxGuests",
      b."planId",
      b."eventExpiresAt",
      b."occasionType"
    FROM "birthdayPrivateGuests" g
    JOIN "birthdayEvents" b 
      ON g."birthdayEventId" = b.id
    WHERE g.code = ${code}
  `;

  const row = data[0];

  if (!row) {
    return entireScreenMessage("Invitación inválida");
  }

  if (!row.guestActive) {
    return entireScreenMessage("Invitación bloqueada temporalmente");
  }

  /* =========================
     STATUS
  ========================= */

  const eventState = getEventAccessState(row);

  if (eventState.state === State.nok) {
    return entireScreenMessage(eventState.msg);
  }

  if (isEventDeadline(row)) {
    return entireScreenMessage("Evento finalizado");  
  }

  /* =========================
     🔥 NUEVO: GALERIA
  ========================= */

  const galleryData = await sql`
    SELECT 
      id,
      picture,
      thumbnail,
      description
    FROM "birthdayGallery"
    WHERE "birthdayEventId" = ${row.id}
      AND "isActive" = true
    ORDER BY position ASC, id ASC
  `;

  const gallery = galleryData.map((g, index) => ({
    id: g.id,
    picture: g.picture?.startsWith("/") ? g.picture : `/${g.picture}`,
    slot:index+1,
    thumbnail: g.thumbnail
      ? g.thumbnail.startsWith("/")
        ? g.thumbnail
        : `/${g.thumbnail}`
      : undefined,
    description: g.description,
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
    personMaxGuestOpenEvent: 0,
    gallery,
    galleryTitle: row.galleryTitle,
    rsvpDeadline: row.rsvpDeadline,
    maxGuests: row.maxGuests,    
    planMaxGuests:0,
    planId:row.planId,
    eventExpiresAt:row.eventExpiresAt,
  };

  const guest = {
    id: row.guest_id,
    name: row.guest_name,
    code: row.code,
    foodType: row.foodType,
    rsvpStatus: row.rsvpStatus,
    rsvpMessage: row.rsvpMessage,
    birthdayEventId: row.id,
    peopleLimit: row.peopleLimit,
    peopleConfirmed: row.peopleConfirmed,
  };

  return (
    <EventPageView
      event={event}
      guest={guest}
      editable={false}
    />
  );
}