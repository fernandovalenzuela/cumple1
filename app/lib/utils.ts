
/*export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};*/

import { PaymentProviderType, Status, PaymentStatus, OccasionType} from "@/lib/constants";

export function formatCurrency(value:number,currency:string,locale="es-AR"){
  return new Intl.NumberFormat(locale,{style:"currency",currency,maximumFractionDigits:2}).format(value);
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

  export function formatDateTimeLocal(value: string) {
    if (!value) return "";

    const date = new Date(value);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  export function formatLongDate(dateString: string) {
    const date = new Date(dateString)

    const day = date.getDate()
    const year = date.getFullYear()

    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    const month = months[date.getMonth()]

    return `${day} de ${month} de ${year}`
  }

/**
 * Returns the time portion of a date formatted according to the user's local settings.
 * @param dateOrString - Optional Date object or date string to format. Defaults to current time.
 * @param long - If true, includes seconds in the output. Defaults to true.
 * @returns Formatted time string (e.g., "6:00:15 PM" vs "6:00 PM" based on user preferences).
 */
export function getLocalTime(dateOrString?: Date | string, long: boolean = true): string {
  //console.log("hora",dateOrString);
  const date = dateOrString 
    ? new Date(dateOrString) 
    : new Date();

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23", // ACA DEBE modificarse para que tome la hora local y no fuerce formato 24 hs
  };

  // If long is true, we dynamically add seconds to the formatting options
  if (long) {
    options.second = "2-digit";
  }

  return date.toLocaleTimeString(undefined, options);
}

export function getDisplayAddress(address: string | null) {
  if (address === null || address.trim() === "") {
    return "";
  }
  const parts = address
    .split(",")
    .map((x) => x.trim());

  const street = parts[0] || "";
  const extra = parts[1] || "";

  return extra
    ? `${street}, ${extra}`
    : street;
}

export function getMapAddress(address:string|null|undefined){

  if(!address)
    return "";

  const [
    street,
    ,
    city,
    state,
    country,
  ]=address.split(",");

  return[
    street,
    city,
    state,
    country,
  ]
    .filter(Boolean)
    .join(",");

}



export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};


export const formatFriendlyDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // 🟢 recién (menos de 1 min)
  if (diffSec < 60) {
    return "recién";
  }

  // 🟢 hace minutos
  if (diffMin < 60) {
    return `hace ${diffMin} min`;
  }

  // 🟢 hace horas (mismo día)
  if (diffHour < 24 && now.getDate() === date.getDate()) {
    return `hace ${diffHour} h`;
  }

  // 🟢 hoy (pero hace más de X horas)
  const isSameDay =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();

  if (isSameDay) {
    return `hoy ${date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 🔥 formato 24h
    })}`;
  }

  // 🟡 ayer
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `ayer ${date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }

  // 🔵 más viejo → fecha completa + hora 24h
  return date.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export function getEventLink({
  accessType,
  code,
  slug,
}: {
  accessType: number;
  code?: string;
  slug?: string;
}) {
  switch (accessType) {
    case 1:
      return `/i/${code}`;

    case 2:
    case 3:
      return `/e/${slug}`;

    default:
      return "/";
  }
}

export async function compressImage(file: File) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);

  await new Promise((res) => (img.onload = res));

  const canvas = document.createElement("canvas");
  const maxWidth = 1280;

  const scale = maxWidth / img.width;

  canvas.width = maxWidth;
  canvas.height = img.height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob!),
      "image/jpeg",
      0.7
    );
  });
}

/**
 * Calcula la fecha límite para confirmar asistencia (RSVP), 
 * restando exactamente 2 días a la fecha del evento.
 * 
 * @param eventBirthday - La fecha del evento (puede ser un objeto Date, un string ISO, o un timestamp)
 * @returns Un nuevo objeto Date con 2 días menos
 */
export function getRsvpDeadlineFromEventBirthday(eventBirthday: Date | string | number): string {
  // Convertimos la entrada a un objeto Date por si viene como string o timestamp
  const eventDate = new Date(eventBirthday);

  // Validamos que la fecha sea válida antes de operar con ella
  if (isNaN(eventDate.getTime())) {
    throw new Error("La fecha proporcionada no es válida.");
  }

  // Restamos 2 días
  const deadlineDate = new Date(eventDate);
  deadlineDate.setDate(eventDate.getDate() - 2);

  return formatDateTimeLocal(deadlineDate.toDateString());
}


export async function optimizeImage(
  file: File,
  maxSize = 1600,
  quality = 0.82,
): Promise<File> {

  // No tocar SVG ni GIF animados
  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  if ( file.type === "image/webp" && file.size < 400 * 1024){
      return file;
  }

  const bitmap = await createImageBitmap(file);

  let width = bitmap.width;
  let height = bitmap.height;

  // Mantener relación de aspecto
  if (width > height) {

    if (width > maxSize) {
      height = Math.round(height * maxSize / width);
      width = maxSize;
    }

  } else {

    if (height > maxSize) {
      width = Math.round(width * maxSize / height);
      height = maxSize;
    }

  }

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx)
    throw new Error("No se pudo crear el canvas.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    bitmap,
    0,
    0,
    width,
    height
  );

  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {

    canvas.toBlob(
      b => {

        if (!b) {
          reject(new Error("No se pudo generar la imagen."));
          return;
        }

        resolve(b);

      },
      "image/webp",
      quality
    );

  });

  return new File(
    [blob],
    file.name.replace(/\.[^.]+$/, ".webp"),
    {
      type: "image/webp",
      lastModified: Date.now(),
    }
  );

}

type PaymentProviderInfo={
  id:string;
  caption:string;
  icon:string;
  description:string;
}

export function getPaymentProviderInfo(provider: number): PaymentProviderInfo {
  const none =  {id:"0",caption:"Ninguno",icon:"", description: "No hay medio de pago disponible"};
  if (!provider) {
      return none;
  }
  switch (provider) {
      case PaymentProviderType.None:
        return none;
      case PaymentProviderType.MercadoPagoAR:
        return {id:"1",caption:"Mercado Pago",icon:"/payment/mp_ar.webp",description:"MP Argentina"};
      case PaymentProviderType.Stripe:
        return {id:"2",caption:"Stripe",icon:"/payment/stripe.png",description:"Stripe"};
      case PaymentProviderType.PayPal:
        return {id:"3",caption:"PayPal",icon:"/payment/paypal.png",description:"PayPal"};
      case PaymentProviderType.Adyen:
        return {id:"4",caption:"Adyen",icon:"/payment/adyen.png",description:"Adyen"};
       case PaymentProviderType.Pix:
        return {id:"5",caption:"Pix",icon:"/payment/pix.png",description:"Pix"};

  }
  return none;
}


export function getIntegerPart(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 0;
  }

  return Math.trunc(value);
}

export function getUrlFromPaymentStatus(paymentStatus:number): string {
  switch(paymentStatus) {

      case PaymentStatus.Created:
        return "/onboarding/editor";

      case PaymentStatus.WaitingPayment:
        return "/onboarding/payment/result";

      case PaymentStatus.PendingVerification:
        return "/onboarding/payment/result";

      case PaymentStatus.Approved:
        return "/revisar";
      
      case PaymentStatus.Rejected:
        return "/revisar";

      case PaymentStatus.Pending:
        return "/revisar";

      case PaymentStatus.Cancelled:
        return "/revisar";

      case PaymentStatus.Expired:
        return "/revisar";

      case PaymentStatus.Refunded:
        return "/revisar";
  }
  return "";
}

/*export function calculateTotal(price:number,discount:number):number {
  if (!price || !discount) {
    throw new Error("Error calculate total");
  } else {
    const discountAmount = Number(price) * Number(discount) / 100;
    const total = Number(Number(price) - discountAmount).toFixed(2);
    return total;

  }
}*/

export function calculateTotal(price: number,discount: number): number {
  return Number( ( price - (price * discount) / 100 ).toFixed(2));
}

type OccasionTypeInfo={
  id:string;
  caption:string;
  icon:string;
  description:string;
}

export function getOccasionTypeInfo(occasionType: number): OccasionTypeInfo {
  const none =  {id:"0",caption:"Seleccionar tipo evento",icon:"", description: "No definido"};
  if (!occasionType) {
      return none;
  }
  switch (occasionType) {
      case OccasionType.None:
        return none;
      case OccasionType.Birthday:
        return {id:(String(OccasionType.Birthday)),caption:"Cumpleaños",icon:"/occasion/unknown.jpg",description:"Fiesta de cumpleaños"};
      case OccasionType.KidsBirthday:
        return {id:(String(OccasionType.KidsBirthday)),caption:"Cumpleaños infantil",icon:"/occasion/unknown.jpg",description:"Fiesta de cumpleaños infantil"};
      case OccasionType.FifteenthBirthday:
        return {id:(String(OccasionType.FifteenthBirthday)),caption:"Cumpleaños de 15",icon:"/occasion/unknown.jpg",description:"Fiesta de cumpleaños de 15"};
      case OccasionType.WeddingAnniversary:
        return {id:(String(OccasionType.WeddingAnniversary)),caption:"Aniversario de casados",icon:"/occasion/unknown.jpg",description:"Aniversario de casados"};
      case OccasionType.Baptism:
        return {id:(String(OccasionType.Baptism)),caption:"Bautismo",icon:"/occasion/unknown.jpg",description:"Bautismo"};
      case OccasionType.Communion:
        return {id:(String(OccasionType.Communion)),caption:"Comunión",icon:"/occasion/unknown.jpg",description:"Comunión"};
      case OccasionType.BarMitzvah:
        return {id:(String(OccasionType.BarMitzvah)),caption:"Bar Mitzvá",icon:"/occasion/unknown.jpg",description:"Bar Mitzvá"};
      case OccasionType.Graduation:
        return {id:(String(OccasionType.Graduation)),caption:"Graduación",icon:"/occasion/unknown.jpg",description:"Graduación"};
      case OccasionType.Anniversary:
        return {id:(String(OccasionType.Anniversary)),caption:"Aniversario",icon:"/occasion/unknown.jpg",description:"Aniversario de cualquier tipo"};
      case OccasionType.BabyShower:
        return {id:(String(OccasionType.BabyShower)),caption:"BabyShower",icon:"/occasion/unknown.jpg",description:"BabyShower"};
      case OccasionType.BridalShower:
        return {id:(String(OccasionType.BridalShower)),caption:"Despedida de solteros",icon:"/occasion/unknown.jpg",description:"Despedida de solteros"};
      case OccasionType.Wedding:
        return {id:(String(OccasionType.Wedding)),caption:"Casamiento/Boda",icon:"/occasion/unknown.jpg",description:"Casamiento/Boda"};
      case OccasionType.GenderReveal:
        return {id:(String(OccasionType.GenderReveal)),caption:"GenderReveal",icon:"/occasion/unknown.jpg",description:"GenderReveal"};
      case OccasionType.Corporate:
        return {id:(String(OccasionType.Corporate)),caption:"Corporativo",icon:"/occasion/unknown.jpg",description:"Corporativo"};
      case OccasionType.Other:
        return {id:(String(OccasionType.Other)),caption:"Otro",icon:"/occasion/unknown.jpg",description:"Otro"};

  }
  return none;
}