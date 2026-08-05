
export type AppearanceOption = {
  value: string | number;
  label: string;
};

/* =========================
   🎨 THEMES
========================= */

export const APPEARANCE_THEMES: AppearanceOption[] = [
  {
    value: "elegant",
    label: "Elegante",
  },
  {
    value: "party",
    label: "Fiesta",
  },
  {
    value: "pink",
    label: "Rosa",
  },
];

/* =========================
   ✍️ FONTS
========================= */

export const APPEARANCE_FONTS: AppearanceOption[] = [
  {
    value: "wixMadeforText",
    label: "Wix Madefor Text",
  },
  {
    value: "poppins",
    label: "Poppins",
  },
  {
    value: "inter",
    label: "Inter",
  },
  {
    value: "roboto",
    label: "Roboto",
  },
  {
    value: "greatVibes",
    label: "Great Vibes",
  },
  {
    value: "pinyonScript",
    label: "Pinyon Script",
  },
  {
    value: "italianno",
    label: "Italianno",
  },
];

/* =========================
   ✨ ANIMATIONS
========================= */

export const APPEARANCE_ANIMATIONS: AppearanceOption[] = [
  {
    value: 0,
    label: "Sin animación",
  },
  {
    value: 1,
    label: "Confetti",
  },
  {
    value: 2,
    label: "Globos",
  },
  {
    value: 3,
    label: "Destellos",
  },
];

/* =========================
   🎯 BACKGROUND MOTIVES
========================= */

export const APPEARANCE_BACKGROUNDS: AppearanceOption[] = [
  {
    value: "heart",
    label: "Corazones",
  },
  {
    value: "soccer_ball",
    label: "Pelotas de fútbol",
  },
];

/* =========================
   🎨 BACKGROUND MAPPER
========================= */

export function getBackgroundMotiveProps(
  motive: string
) {
  switch (motive) {
    case "heart":
      return {
        url: "/background_motive/heart.jpg",
        backgroundSize: "120%",
      };

    case "soccer_ball":
      return {
        url: "/background_motive/soccer_ball.jpg",
        backgroundSize: "60%",
      };

    default:
      return {
        url: "/background_motive/heart.jpg",
        backgroundSize: "120%",
      };
  }
}

export function getBackgroundMotiveNameByUrl(url: string): string {
  if (!url) return "heart"; // Valor por defecto si no hay URL

  // 1. Obtenemos el nombre del archivo con su extensión (ej: "soccer_ball.jpg")
  const fileNameWithExtension = url.substring(url.lastIndexOf("/") + 1);

  // 2. Le quitamos la extensión (ej: ".jpg" o ".png") para quedarnos solo con "soccer_ball"
  const motiveName = fileNameWithExtension.split(".")[0];

  // 3. Opcional: Si por alguna razón el nombre extraído no es válido,
  // podés definir una lista de nombres permitidos o simplemente retornar el valor
  return motiveName || "heart";
}

/* =========================
   ✨ ANIMATION MAPPER
========================= */

export function getAnimation(
  animationType: number
) {
  switch (animationType) {
    case 1:
      return {
        id: 1,
        src: "/animations/confetti.lottie",
      };

    case 2:
      return {
        id: 2,
        src: "/animations/balloons.lottie",
      };

    case 3:
      return {
        id: 3,
        src: "/animations/sparkles.lottie",
      };

    default:
      return null;
  }
}