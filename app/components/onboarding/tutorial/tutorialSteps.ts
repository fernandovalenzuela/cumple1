export interface TutorialStep{
  section:string;
  sectionId:string;
  step:string;
  description:string;
  markerId:string;
}

export const tutorialSteps:TutorialStep[]=[
  {
    section:"Presentación",
    sectionId:"presentation",
    step:"Apariencia",
    description:"Configura colores, tipografía, fondo y animación.",
    markerId:"marker-appearance",
  },
    {
    section:"Presentación",
    sectionId:"presentation",
    step:"Texto de invitación",
    description:"Agrega un breve texto que introduzca la invitación, por ejemplo: “Invitación a”.",
    markerId:"marker-title_2",
  },
  {
    section:"Presentación",
    sectionId:"presentation",
    step:"Nombre",
    description:"Indica el nombre de la persona, pareja, organización o celebración.",
    markerId:"marker-name",
  },
  {
    section:"Presentación",
    sectionId:"presentation",
    step:"Imagen principal",
    description:"Selecciona una imagen que represente al evento o a sus protagonistas",
    markerId:"marker-picture",
  },
  {
    section:"Presentación",
    sectionId:"presentation",
    step:"Título",
    description:"Escribe el título principal de la invitación.",
    markerId:"marker-title_1",
  },
  {
    section:"Presentación", 
    sectionId:"presentation",
    step:"Descripción",
    description:"Escribe un mensaje para contarles a tus invitados sobre la celebración.",
    markerId:"marker-subtitle_1",
  },
  /*{
    section:"Presentación",
    sectionId:"presentation",
    step:"Cuenta regresiva",
    description:"Configura la fecha y hora del evento para la cuenta regresiva.",
    markerId:"marker-eventBirthday-countdown",
  },*/
  {
    section:"Fecha y lugar",
    sectionId:"dateAndPlace",
    step:"Fecha y hora",
     description:"Indica la fecha y hora del evento para que tus invitados puedan agendarlo.",
    markerId:"marker-eventBirthday-info",
  },
  /*{
    section:"Fecha y lugar",
    sectionId:"dateAndPlace",
    step:"Lugar",
    description:"Indica el nombre del lugar donde se realizará la celebración.",
    markerId:"marker-locationName",
  },*/
  {
    section:"Fecha y lugar",
    sectionId:"dateAndPlace",
    step:"Dirección",
    description:"Indica la dirección del evento. Debes ingresarla en forma completa para mostrarla en el mapa.",
    markerId:"marker-locationAddress",
  },
  {
    section:"Fecha y lugar",
    sectionId:"dateAndPlace",
    step:"Foto del lugar",
    description:"Imagen del lugar del evento.",
    markerId:"marker-locationPicture",
  },
  {
    section:"Confirmación de asistencia",
    sectionId:"rsvp",
    step:"Asistencia invitados",
    description:"Configura cómo confirmarán la asistencia tus invitados.",
    markerId:"marker-rsvp",
  },
    {
    section:"Galería",
    sectionId:"gallery",
    step:"Título de la galería",
    description:"Configura el título de tu galería de fotos.",
    markerId:"marker-galleryTitle",
  },
  {
    section:"Mensajes",
    sectionId:"messages",
    step:"Mensajes",
    description:"Configura los mensajes que pueden dejar los invitados.",
    markerId:"marker-messages",
  },
  {
    section:"Mensaje de cierre",
    sectionId:"closingMessage",
    step:"Mensaje final",
    description:"Escribe un mensaje final para despedirte de tus invitados.",
    markerId:"marker-subtitle_2",
  },
];