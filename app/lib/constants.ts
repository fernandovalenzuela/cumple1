export const APP_CONFIG = {
  name: "Birthday App",
};
export const DEFAULTS = {
  country: "AR",
  locale: "es-AR",
  currency: "ARS",
};
export const ONBOARDING = {
  totalSteps: 5,
  maxNameLength: 80,
  maxEmailLength: 120,
  maxPhoneLength: 20,
};
/* =========================
   ENUMS
========================= */
export enum Status {
  Draft = 0, // creado
  Editing = 1, // organizer esta editando el evento
  WaitingPayment = 2, // se esta esperando respuesta del pago
  Paid = 3, // pagado
  PendingReview = 4, // el usuario termino la edicion y esta pendiente de revision
  Scheduled = 5, // programado para publicarse en el futuro
  Published = 6, // publicado
  Finished = 7, // expiró y ya no esta publico
  Suspended = 8, // por ejemplo por denuncia
  Cancelled = 9 // por diferentes motivos
}
export enum AccessType {
  Private = 1,
  PrivateWithPublicReadonly = 2,
  Open = 3,
  PublicWithoutGuests = 4
}

export enum OccasionType{
    None=0,
    Birthday=1,
    KidsBirthday=2,
    FifteenthBirthday=3,
    WeddingAnniversary=4,
    Baptism=5,
    Communion=6,
    BarMitzvah=7,
    Graduation=8,
    Anniversary=9,
    BabyShower=10,
    BridalShower=11,
    Wedding=12,
    GenderReveal=13,
    Corporate=14,
    Other=99,
}

export enum PublicationMode  {
  RequiresApproval = 0, /* default, requiere revision manual luego de configurar y pagar el evento */
  AutomaticPublishing = 1, /* se publica luego que se termina de configurar el evento y es pagado */
  ScheduledPublishing = 2 /* se publica luego de X minutos */
}
export enum ImageProcessingStatus {
  None = 0,
  Pending = 1,
  Donde = 2,
  Failed = 3,
}
export enum State {
  ok = 1,
  nok = 0
}
export enum AccountType {
  Organizer = 0,
  Partner = 1,
  Webmaster = 2,
}
export enum RsvpStatus {
  Pending = 0,
  Yes = 1,
  No = 2,
  DontKnow = 3
}
export enum FoodType {
  None = 0,
  Celiac = 1,
  Vegetarian = 2,
  Vegan = 3
}
export type MessageMode =
  | "private"
  | "open"
  | "public";


export const contactEmail = "contacto@gmail.com";

  /* PAYMENT */

/*export enum PaymentProvider {
  None = 0,
  MercadoPagoAR = 1, // argentina
  Stripe = 2,
  PayPal = 3,
  Adyen = 4,
  Pix = 5,
}*/

export enum PaymentProviderType{
  None = 0,
  MercadoPagoAR = 1, // argentina
  Stripe = 2,
  PayPal = 3,
  Adyen = 4,
  Pix = 5,
}

export enum PaymentStatus{
    Created=0,
    WaitingPayment=1,
    PendingVerification=2,
    Approved=3,
    Rejected=4,
    Cancelled=5,
    Expired=6,
    Refunded=7,
    Pending=8,
}

export enum PaymentSource{
    Checkout=0,
    Webhook=1,
    Manual=2,
    ScheduledTask=3
}