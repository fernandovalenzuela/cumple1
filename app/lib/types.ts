export type EventGalleryItem={
  id:number;
  slot:number;
  picture:string;
  thumbnail?:string;
  description?:string;
  status?:
    |"unchanged"
    |"new"
    |"updated"
    |"deleted";
};

export type Event={

  eventId:number;
  accountId?:number | null;
  accessType:number;
  occasionType:number; // birthday, wedding, etc
  status:number;
  email?:string | null;
  waPhone?:string | null;
  passwordHash?:string | null;
  imageProcessingStatus?:number | null;

  /* HERO / PORTADA */
  name: string;
  title_1: string;
  title_2?: string | null;
  subtitle_1:string;
  theme?: string | null;
  picture: string;
  animationType:number;
  fontType?: string | null;
  backgroundMotive?:any;

  /* EVENTO */
  eventBirthday: string;
  birthday?: string | null; /* por ahora este campo no se usa*/
  celebratedAge?: number | null;
  isMinorEvent?: boolean | null;

  /* UBICACIÓN */
  locationName: string;
  locationAddress: string | null;
  locationPicture: string;
  latitude?: number | null;
  longitude?: number | null;

  /* RSVP */
  rsvpDeadline: string | null;
  deadline?: string | null;
  allowMessages: boolean;
  showMessagesList: boolean;
  maxGuests: number | null;
  personMaxGuestOpenEvent: number;
  askFoodType: boolean;

  /* GALERÍA */
  maxPicsGallery?: number | null;
  galleryTitle: string;
  gallery: EventGalleryItem[];
  
  /* FOOTER */
  subtitle_2: string;

  /* SISTEMA */
  publicSlug?: string | null;
  isActive?: boolean | null;  
  eventExpiresAt: string | null; // hasta cuando puede estar publicado el evento: ( birthdayEvents.paymentDate + birthdayPlans.planDurationDays)
  
  /* OTHER */
  internalComment?:string | null;
  customerComment?:string | null;

  /* PLAN */
  planId:number; // recordar que si se cambia algo del plan, se debe generar un nuevo registro y poner active=false el anterior 
  planMaxGuests:number;

  /*  */


}

export type SaveEventData={
  event:Event;
  pendingFiles:Record<string,File>;
  pendingGalleryFiles:Record<string,File>;
};


export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };