import { AccessType, OccasionType } from "@/lib/constants";
import type { Event } from "@/lib/types";

export const RSVP_DEFAULTS = {
  accessType: AccessType.Open,
  personMaxGuestOpenEvent: 2,
  maxGuests: 0,
  askFoodType: false,
  allowMessages: true,
  showMessagesList: true,
  rsvpDeadline: "",
};

export const EVENT_DEFAULTS = {
  eventId: 0,
  occasionType: OccasionType.None, // birthday, wedding, etc
  name: "[Completar...]",
  title_1: "[Completar...]",
  title_2: "[Completar...]",
  status: 0,
  subtitle_1: "[Completar...]",
  subtitle_2: "[Completar...]",
  eventBirthday: "",
  picture: "/client/people/unknown_person.jpg",
  locationName: "",
  locationAddress: "",
  locationPicture: "/client/location/unknown_location.jpg",
  galleryTitle: "Buenos momentos ✨",
  theme: "elegant",
  animationType: 1,
  backgroundMotive: "heart",
  fontType: "Poppins",
  maxPicsGallery: 3,
  gallery: [],
};

/* ===============================================
   🎯 TYPE (ALINEADO A DB), excepto id => eventId
================================================== */
export const DEFAULT_EVENT: Event = {
  eventId: 0,
  occasionType: OccasionType.None, // birthday, wedding, etc
  name: EVENT_DEFAULTS.name,
  title_1: EVENT_DEFAULTS.title_1,
  status: EVENT_DEFAULTS.status,
  subtitle_1: EVENT_DEFAULTS.subtitle_1,
  picture: EVENT_DEFAULTS.picture,
  locationName: EVENT_DEFAULTS.locationName,
  locationAddress: EVENT_DEFAULTS.locationAddress,
  eventBirthday: "",
  locationPicture: EVENT_DEFAULTS.locationPicture,
  galleryTitle: EVENT_DEFAULTS.galleryTitle,
  gallery: EVENT_DEFAULTS.gallery,
  subtitle_2: EVENT_DEFAULTS.subtitle_2,
  theme: EVENT_DEFAULTS.theme,
  animationType: EVENT_DEFAULTS.animationType,
  backgroundMotive: EVENT_DEFAULTS.backgroundMotive,
  fontType: EVENT_DEFAULTS.fontType,
  maxPicsGallery: EVENT_DEFAULTS.maxPicsGallery,
  allowMessages: RSVP_DEFAULTS.allowMessages,
  showMessagesList: RSVP_DEFAULTS.showMessagesList,
  askFoodType: RSVP_DEFAULTS.askFoodType,
  personMaxGuestOpenEvent: RSVP_DEFAULTS.personMaxGuestOpenEvent,
  accessType: RSVP_DEFAULTS.accessType,
  rsvpDeadline: RSVP_DEFAULTS.rsvpDeadline,
  maxGuests: RSVP_DEFAULTS.maxGuests,
  planId:0,
  planMaxGuests:0, // este campo solo tiene sentido en el onboarding -> app/onboarding/editor/page.tsx
  eventExpiresAt: null,

};