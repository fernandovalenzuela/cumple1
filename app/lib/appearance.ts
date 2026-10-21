import { OccasionType } from "@/lib/constants";

export type AppearanceOption = {
  value: string | number;
  label: string;
};

export type AppearanceTemplate = {
  value:string;

  label:string;
  englishLabel:string;
  description:string;

  colorValue:string;
  fontValue:string;
  animationValue:number;
  backgroundValue:string;

  audience:AppearanceColorAudience[];

  primaryOccasions:OccasionType[];
  compatibleOccasions:OccasionType[];

  occasionTypeDefaults: OccasionType[];
};

/** INICIO-TEMPLATES */
export const APPEARANCE_TEMPLATES: AppearanceTemplate[] = [
    {
    value:"celebration0",
    label:"Celebremos",
    englishLabel:"Lets Celebrate",
    description:"",
    colorValue:"aqua-pool-party",
    fontValue:"greatVibes",
    animationValue:22,
    backgroundValue:"guirnald1",
    audience:["universal","kids","teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Party,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.BarMitzvah,
      OccasionType.BatMitzvah,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.GenderReveal,
      OccasionType.Corporate,
      OccasionType.Other
    ],
        compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.BarMitzvah,
      OccasionType.BatMitzvah,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.GenderReveal,
      OccasionType.Corporate,
      OccasionType.Other
    ],
    occasionTypeDefaults: [OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Party,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.BarMitzvah,
      OccasionType.BatMitzvah,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.GenderReveal,
      OccasionType.Corporate,
      OccasionType.Other],
  },
  {
    value:"cumple1",
    label:"Fiesta de Verano",
    englishLabel:"Summer Celebration",
    description:"",
    colorValue:"summer-splash",
    fontValue:"montserrat",
    animationValue:22,
    backgroundValue:"guirnald1",
    audience:["universal","kids","teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.BarMitzvah,
      OccasionType.BatMitzvah,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.GenderReveal,
      OccasionType.Party,
      OccasionType.Other,
      OccasionType.Corporate
    ],
    compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.BarMitzvah,
      OccasionType.BatMitzvah,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.GenderReveal,
      OccasionType.Other,
      OccasionType.Corporate
    ],
    occasionTypeDefaults: [],
  },

  {
    value:"cumple2",
    label:"Fiesta de Colores",
    englishLabel:"Colorful Celebration",
    description:"",
    colorValue:"color-fiesta",
    fontValue:"monoton",
    animationValue:20,
    backgroundValue:"guirnald7",
    audience:["universal","kids","teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Party,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.BarMitzvah,
      OccasionType.BatMitzvah,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.Wedding,
      OccasionType.Corporate,
      OccasionType.Other
    ],
    compatibleOccasions:[
      OccasionType.Party,
      OccasionType.FifteenthBirthday,
      OccasionType.KidsBirthday,
      OccasionType.Birthday,
      OccasionType.WeddingAnniversary,
      OccasionType.BatMitzvah,
      OccasionType.BridalShower,
      OccasionType.Wedding,
      OccasionType.Graduation,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.Anniversary,
      OccasionType.GenderReveal,
      OccasionType.Corporate,
      OccasionType.BabyShower,
      OccasionType.BarMitzvah,
      OccasionType.Other
    ],
    occasionTypeDefaults: [],
  },

  {
    value: "birthday-king-1",
    label: "Rey de la Fiesta",
    englishLabel: "King of the Party",
    description: "Cumple de Rey 1",
    colorValue: "tropical-fiesta",
    fontValue: "cinzelDecorative",
    animationValue: 12,
    backgroundValue: "baloons_arch10",
    audience: ["universal"],
    primaryOccasions: [OccasionType.Birthday, OccasionType.KidsBirthday, OccasionType.Graduation, ],
    compatibleOccasions: [OccasionType.Party],
    occasionTypeDefaults: [],
  },

  {
    value: "birthday-king-2",
    label: "Rey de las Nubes",
    englishLabel: "King of the Clouds",
    description: "Cumple de Rey 2",
    colorValue: "sky-cloud",
    fontValue: "caveat",
    animationValue: 12,
    backgroundValue: "baloons_arch10",
    audience: ["universal"],
    primaryOccasions: [OccasionType.Birthday, OccasionType.KidsBirthday, OccasionType.Graduation, ],
    compatibleOccasions: [OccasionType.Party],
    occasionTypeDefaults: [],
  },

  {
    value: "birthday-king-3",
    label: "Rey del Jardín",
    englishLabel: "Garden King",
    description: "Cumple de Rey 3",
    colorValue: "pastel-meadow",
    fontValue: "dancingScript",
    animationValue: 9,
    backgroundValue: "baloons_arch10",
    audience: ["universal"],
    primaryOccasions: [OccasionType.Birthday, OccasionType.KidsBirthday, OccasionType.Graduation, ],
    compatibleOccasions: [OccasionType.Party],
    occasionTypeDefaults: [],
  },

  {
    value: "birthday-party-1",
    label: "Fiesta Azul",
    englishLabel: "Blue Celebration",
    description: "Cumple Fiesta 1",
    colorValue: "mediterranean-blue",
    fontValue: "greatVibes",
    animationValue: 12,
    backgroundValue: "guirnald1",
    audience: ["universal"],
    primaryOccasions: [OccasionType.Birthday, OccasionType.KidsBirthday, OccasionType.Graduation, ],
    compatibleOccasions: [OccasionType.Party],
    occasionTypeDefaults: [],
  },

  {
    value: "birthday-karaoke-1",
    label: "Noche de Karaoke",
    englishLabel: "Karaoke Night",
    description: "Cumple Karaoke",
    colorValue: "sky-cloud",
    fontValue: "dancingScript",
    animationValue: 14,
    backgroundValue: "guirnald1",
    audience: ["universal"],
    primaryOccasions: [OccasionType.Birthday, OccasionType.KidsBirthday, OccasionType.Graduation, ],
    compatibleOccasions: [OccasionType.Party],
    occasionTypeDefaults: [],
  },

  {
    value:"sparkling-celebration",
    label:"Celebración Brillante",
    englishLabel:"Sparkling Celebration",
    description:"",
    colorValue:"mint-confetti",
    fontValue:"poppins",
    animationValue:20,
    backgroundValue:"baloons_arch3",
    audience:["universal","kids"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Communion,
      OccasionType.BabyShower
    ],
    compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.BabyShower
    ],
    occasionTypeDefaults: [],
  },

  {
    value:"prueba1",
    label:"Cielo Elegante",
    englishLabel:"Elegant Sky",
    description:"",
    colorValue:"sky-cloud",
    fontValue:"cormorantGaramond",
    animationValue:12,
    backgroundValue:"baloons_arch1",
    audience:["universal","teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.BarMitzvah
    ],
    compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday
    ],
    occasionTypeDefaults: [],
  },

  {
    value:"elegant-toast",
    label:"Brindis de Gala",
    englishLabel:"Gala Toast",
    description:"",
    colorValue:"black-gold",
    fontValue:"pinyonScript",
    animationValue:11,
    backgroundValue:"flowers4",
    audience:["teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Party,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.Wedding,
      OccasionType.Corporate,
      OccasionType.Other
    ],
    compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.FifteenthBirthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Communion,
      OccasionType.Anniversary,
      OccasionType.Wedding,
      OccasionType.Corporate,
      OccasionType.Other
    ],
    occasionTypeDefaults: [],
  },

  {
    value:"royal-dream1",
    label:"Sueño Real de Fantasía",
    englishLabel:"Royal Fantasy",
    description:"",
    colorValue:"pastel-candy",
    fontValue:"italianno",
    animationValue:19,
    backgroundValue:"baloons_arch4",
    audience:["kids","teens"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Party,
      OccasionType.WeddingAnniversary,
      OccasionType.Anniversary,
      OccasionType.BabyShower
    ],
    compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.Communion,
      OccasionType.WeddingAnniversary,
      OccasionType.BabyShower
    ],
    occasionTypeDefaults: [],
      },

    {
    value:"royal-dream2",
    label:"Sueño Real Dorado",
    englishLabel:"Golden Royal Dream",
    description:"",
    colorValue:"sunny-celebration",
    fontValue:"cinzelDecorative",
    animationValue:22,
    backgroundValue:"baloons_arch4",
    audience:["universal","kids","teens"],
    primaryOccasions:[
        OccasionType.Birthday,
        OccasionType.KidsBirthday,
        OccasionType.WeddingAnniversary,
        OccasionType.FifteenthBirthday,
        OccasionType.BabyShower,
        OccasionType.BridalShower,
        OccasionType.Wedding,
        OccasionType.Party
      ],
          compatibleOccasions:[
        OccasionType.Party,
        OccasionType.KidsBirthday,
        OccasionType.WeddingAnniversary,
        OccasionType.BabyShower,
        OccasionType.BridalShower,
        OccasionType.Wedding
      ],
    occasionTypeDefaults: [],
    },

    {
    value:"royal-dream3",
    label:"Sueño Real Lavanda",
    englishLabel:"Lavender Royal Dream",
    description:"",
    colorValue:"lavender-dream",
    fontValue:"cinzelDecorative",
    animationValue:23,
    backgroundValue:"baloons_arch4",
    audience:["universal","kids","teens"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Anniversary,
      OccasionType.BabyShower
    ],
        compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.BabyShower
    ],
    occasionTypeDefaults: [],
  },

  {
    value:"royal-dream4",
    label:"Sueño Real Rosa",
    englishLabel:"Pink Royal Dream",
    description:"",
    colorValue:"bubblegum-pop",
    fontValue:"dancingScript",
    animationValue:23,
    backgroundValue:"baloons_arch4",
    audience:["universal","kids","teens"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.Wedding,
      OccasionType.WeddingAnniversary
    ],
        compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.WeddingAnniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.Wedding
    ],
    occasionTypeDefaults: [],
  },

    {
    value:"champion-party",
    label:"Gran Fiesta del Campeón",
    englishLabel:"Champion's Grand Party",
    description:"",
    colorValue:"sunny-celebration",
    fontValue:"cinzelDecorative",
    animationValue:22,
    backgroundValue:"baloons_arch9",
    audience:["universal","kids","teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Party,
      OccasionType.Graduation
    ],
        compatibleOccasions:[
      OccasionType.Party,
      OccasionType.KidsBirthday,
      OccasionType.Birthday,
      OccasionType.FifteenthBirthday
    ],
    occasionTypeDefaults: [],
    }, 
    
    {
    value:"wedding1",
    label:"Boda en el Jardín",
    englishLabel:"Garden Wedding",
    description:"",
    colorValue:"sage-garden",
    fontValue:"greatVibes",
    animationValue:21,
    backgroundValue:"wedding_arch1",
    audience:["adults"],
    primaryOccasions:[
      OccasionType.WeddingAnniversary,
      OccasionType.Wedding
    ],
        compatibleOccasions:[
      OccasionType.Wedding,
      OccasionType.WeddingAnniversary
    ],
    occasionTypeDefaults: [OccasionType.Wedding,
      OccasionType.WeddingAnniversary],
    },

    {
    value:"stars-hearts1",
    label:"Estrellas y Corazones",
    englishLabel:"Stars & Hearts",
    description:"",
    colorValue:"lavender-dream",
    fontValue:"cinzelDecorative",
    animationValue:23,
    backgroundValue:"stars1",
    audience:["kids","teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.Party,
      OccasionType.WeddingAnniversary,
      OccasionType.Communion,
      OccasionType.Baptism,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.GenderReveal
    ],
        compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Birthday,
      OccasionType.KidsBirthday,
      OccasionType.FifteenthBirthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Baptism,
      OccasionType.Communion,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BabyShower,
      OccasionType.BridalShower,
      OccasionType.GenderReveal
    ],
    occasionTypeDefaults: [],
  },

  {
    value:"dreamed-love",
    label:"Amor de Ensueño",
    englishLabel:"Dreamy Love",
    description:"",
    colorValue:"ocean-pop",
    fontValue:"dancingScript",
    animationValue:23,
    backgroundValue:"none",
    audience:["universal","teens","adults"],
    primaryOccasions:[
      OccasionType.Birthday,
      OccasionType.WeddingAnniversary,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.BridalShower,
      OccasionType.Wedding,
      OccasionType.Corporate
    ],
        compatibleOccasions:[
      OccasionType.Party,
      OccasionType.Graduation,
      OccasionType.Anniversary,
      OccasionType.Wedding
    ],
    occasionTypeDefaults: [],
  },

];
/** FIN-TEMPLATES */


/* =========================
   🎨 COLOR PALETTES
========================= */

export type AppearanceColorGroup = "birthday" | "celebration" | "natural" | "formal" | "special" | "vibrant" | "elegant" | "soft" | "none";
export type AppearanceColorIntensity = "soft" | "medium" | "vibrant" | "elegant" | "none";
export type AppearanceColorAudience = "kids" | "teens" | "adults" | "universal";

export type AppearanceColor = {
  value:string;
  label:string;
  englishLabel:string;
  description:string;
  group:AppearanceColorGroup;
  intensity:AppearanceColorIntensity;
  audience:AppearanceColorAudience[];
  primaryOccasions:OccasionType[];
  compatibleOccasions:OccasionType[];
};

/** INICIO-PALETAS */

/* =========================
   🎨 COLOR PALETTES
========================= */

export const APPEARANCE_COLORS: AppearanceColor[] = [
  {
    value:"none",
    label:"Sin Paleta",
    englishLabel:"None",
    description:"",
    group:"none",
    intensity:"none",
    audience:[],
    primaryOccasions:[],
    compatibleOccasions:[],
  },
  {
    value:"romantic-blush",
    label:"Rosa Romántico",
    englishLabel:"Romantic Blush",
    description:"Romántico, delicado, cálido y sofisticado.",
    group:"birthday",
    intensity:"soft",
    audience:["teens","adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.FifteenthBirthday],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.BabyShower,OccasionType.BridalShower,OccasionType.Wedding,OccasionType.Baptism,OccasionType.Party,OccasionType.GenderReveal]
  },
  {
    value:"pastel-candy",
    label:"Caramelo Pastel",
    englishLabel:"Pastel Candy",
    description:"Dulce, alegre, tierno y divertido.",
    group:"birthday",
    intensity:"soft",
    audience:["kids","universal"],
    primaryOccasions:[OccasionType.KidsBirthday,OccasionType.Birthday],
    compatibleOccasions:[OccasionType.BabyShower,OccasionType.GenderReveal,OccasionType.Party,OccasionType.Communion]
  },
  {
    value:"lavender-dream",
    label:"Sueño Lavanda",
    englishLabel:"Lavender Dream",
    description:"Soñador, mágico, delicado y ligeramente fantástico.",
    group:"birthday",
    intensity:"soft",
    audience:["kids","teens","adults"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.FifteenthBirthday],
    compatibleOccasions:[OccasionType.KidsBirthday,OccasionType.BridalShower,OccasionType.BabyShower,OccasionType.Communion,OccasionType.Baptism,OccasionType.Wedding,OccasionType.Party]
  },
 {
    value:"peach-sorbet",
    label:"Sorbete de Durazno",
    englishLabel:"Peach Sorbet",
    description:"Alegre, luminoso, cálido y juvenil.",
    group:"birthday",
    intensity:"medium",
    audience:["kids","teens","adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.KidsBirthday],
    compatibleOccasions:[OccasionType.Party,OccasionType.BabyShower,OccasionType.BridalShower,OccasionType.GenderReveal,OccasionType.Wedding,OccasionType.WeddingAnniversary]
  },
  {
  value:"pink-pink",
  label:"Rosa Rosa",
  englishLabel:"Rosa Pink",
  description:"Dulce, alegre, femenino y juvenil, con un rosa intenso pero delicado.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","universal"],
  primaryOccasions:[
    OccasionType.KidsBirthday,
    OccasionType.Birthday,
    OccasionType.FifteenthBirthday
  ],
  compatibleOccasions:[
    OccasionType.BabyShower,
    OccasionType.GenderReveal,
    OccasionType.Party,
    OccasionType.Communion,
    OccasionType.Graduation,
    OccasionType.Anniversary
  ]
},
  {
    value:"sky-cloud",
    label:"Cielo y Nubes",
    englishLabel:"Sky & Cloud",
    description:"Limpio, tranquilo, luminoso e inocente.",
    group:"birthday",
    intensity:"soft",
    audience:["kids","universal"],
    primaryOccasions:[OccasionType.KidsBirthday,OccasionType.BabyShower],
    compatibleOccasions:[OccasionType.Birthday,OccasionType.Baptism,OccasionType.Communion,OccasionType.GenderReveal,OccasionType.Wedding,OccasionType.Party]
  },
  {
    value:"mint-confetti",
    label:"Confeti Menta",
    englishLabel:"Mint Confetti",
    description:"Fresco, divertido, moderno y ligero.",
    group:"birthday",
    intensity:"medium",
    audience:["kids","teens","universal"],
    primaryOccasions:[OccasionType.KidsBirthday,OccasionType.Birthday],
    compatibleOccasions:[OccasionType.Party,OccasionType.BabyShower,OccasionType.GenderReveal,OccasionType.Communion]
  },

 {
    value:"soft-rainbow",
    label:"Arcoíris Suave",
    englishLabel:"Soft Rainbow",
    description:"Optimista, alegre, inclusivo y juguetón sin ser estridente.",
    group:"birthday",
    intensity:"medium",
    audience:["kids","universal"],
    primaryOccasions:[OccasionType.KidsBirthday,OccasionType.Birthday],
    compatibleOccasions:[OccasionType.Party,OccasionType.BabyShower,OccasionType.GenderReveal,OccasionType.Communion]
  },
  {
    value:"sunny-celebration",
    label:"Celebración Soleada",
    englishLabel:"Sunny Celebration",
    description:"Feliz, energético, luminoso y optimista.",
    group:"birthday",
    intensity:"vibrant",
    audience:["kids","teens","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.KidsBirthday,OccasionType.Party],
    compatibleOccasions:[OccasionType.Graduation,OccasionType.BabyShower,OccasionType.GenderReveal]
  },
  {
    value:"cherry-party",
    label:"Fiesta Cereza",
    englishLabel:"Cherry Party",
    description:"Divertido, moderno, energético y ligeramente retro.",
    group:"birthday",
    intensity:"vibrant",
    audience:["teens","adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Party],
    compatibleOccasions:[OccasionType.FifteenthBirthday,OccasionType.WeddingAnniversary,OccasionType.Graduation]
  },
  {
    value:"tropical-fiesta",
    label:"Fiesta Tropical",
    englishLabel:"Tropical Fiesta",
    description:"Veraniego, energético, exuberante y festivo.",
    group:"birthday",
    intensity:"vibrant",
    audience:["kids","teens","adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Party],
    compatibleOccasions:[OccasionType.KidsBirthday,OccasionType.FifteenthBirthday,OccasionType.Wedding,OccasionType.WeddingAnniversary,OccasionType.GenderReveal]
  },
  {
    value:"bubblegum-pop",
    label:"Pop Chicle",
    englishLabel:"Bubblegum Pop",
    description:"Pop, juvenil, divertido, expresivo y energético.",
    group:"birthday",
    intensity:"vibrant",
    audience:["kids","teens"],
    primaryOccasions:[OccasionType.KidsBirthday,OccasionType.FifteenthBirthday],
    compatibleOccasions:[OccasionType.Birthday,OccasionType.Party,OccasionType.GenderReveal]
  },
  {
    value:"aqua-pool-party",
    label:"Fiesta de Piscina Aqua",
    englishLabel:"Aqua Pool Party",
    description:"Refrescante, juvenil, veraniego y festivo.",
    group:"birthday",
    intensity:"vibrant",
    audience:["kids","teens","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.KidsBirthday,OccasionType.Party],
    compatibleOccasions:[OccasionType.Graduation,OccasionType.Wedding,OccasionType.GenderReveal]
  },
  {
    value:"berry-plum",
    label:"Frutos Rojos y Ciruela",
    englishLabel:"Berry & Plum",
    description:"Sofisticado, profundo, moderno y elegante.",
    group:"celebration",
    intensity:"elegant",
    audience:["teens","adults"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.FifteenthBirthday],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.Party,OccasionType.Wedding,OccasionType.BridalShower,OccasionType.Graduation]
  },
  {
    value:"midnight-celebration",
    label:"Celebración de Medianoche",
    englishLabel:"Midnight Celebration",
    description:"Nocturno, sofisticado y pensado para celebraciones especiales.",
    group:"celebration",
    intensity:"elegant",
    audience:["teens","adults"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.FifteenthBirthday,OccasionType.Party],
    compatibleOccasions:[OccasionType.Wedding,OccasionType.WeddingAnniversary,OccasionType.Graduation,OccasionType.BarMitzvah,OccasionType.BatMitzvah,OccasionType.Corporate]
  },
  {
    value:"emerald-luxe",
    label:"Esmeralda de Lujo",
    englishLabel:"Emerald Luxe",
    description:"Lujoso, natural, profundo y sofisticado.",
    group:"celebration",
    intensity:"elegant",
    audience:["teens","adults"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Wedding,OccasionType.WeddingAnniversary],
    compatibleOccasions:[OccasionType.FifteenthBirthday,OccasionType.Party,OccasionType.Graduation,OccasionType.BarMitzvah,OccasionType.BatMitzvah,OccasionType.Corporate]
  },
  {
    value:"cobalt-silver",
    label:"Cobalto y Plata",
    englishLabel:"Cobalt & Silver",
    description:"Moderno, intenso, sofisticado y festivo.",
    group:"celebration",
    intensity:"vibrant",
    audience:["teens","adults"],
    primaryOccasions:[OccasionType.FifteenthBirthday,OccasionType.Graduation],
    compatibleOccasions:[OccasionType.Birthday,OccasionType.Party,OccasionType.BarMitzvah,OccasionType.BatMitzvah,OccasionType.Corporate]
  },
  {
    value:"terracotta-sunset",
    label:"Atardecer Terracota",
    englishLabel:"Terracotta Sunset",
    description:"Cálido, adulto, relajado y sofisticado.",
    group:"natural",
    intensity:"medium",
    audience:["adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Wedding,OccasionType.WeddingAnniversary],
    compatibleOccasions:[OccasionType.Party,OccasionType.BridalShower,OccasionType.Corporate,OccasionType.Graduation]
  },
  {
    value:"mocha-cream",
    label:"Moka y Crema",
    englishLabel:"Mocha & Cream",
    description:"Cálido, minimalista, adulto, confortable y contemporáneo.",
    group:"natural",
    intensity:"soft",
    audience:["adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.WeddingAnniversary],
    compatibleOccasions:[OccasionType.Wedding,OccasionType.Party,OccasionType.Corporate,OccasionType.Graduation,OccasionType.BridalShower]
  },
  {
    value:"sage-garden",
    label:"Jardín de Salvia",
    englishLabel:"Sage Garden",
    description:"Natural, tranquilo, fresco y elegante.",
    group:"natural",
    intensity:"soft",
    audience:["universal"],
    primaryOccasions:[OccasionType.Wedding,OccasionType.Birthday,OccasionType.BabyShower],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.Baptism,OccasionType.Communion,OccasionType.BridalShower,OccasionType.Graduation,OccasionType.Corporate]
  },
  {
    value:"boho-sand",
    label:"Arena Boho",
    englishLabel:"Boho Sand",
    description:"Relajado, natural, artesanal y contemporáneo.",
    group:"natural",
    intensity:"soft",
    audience:["adults","universal"],
    primaryOccasions:[OccasionType.Wedding,OccasionType.Birthday],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.BridalShower,OccasionType.BabyShower,OccasionType.Party,OccasionType.Corporate]
  },
  {
    value:"dusty-blue-romance",
    label:"Romance Azul Empolvado",
    englishLabel:"Dusty Blue Romance",
    description:"Romántico, sereno, refinado y atemporal.",
    group:"natural",
    intensity:"soft",
    audience:["universal"],
    primaryOccasions:[OccasionType.Wedding,OccasionType.Birthday],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.Baptism,OccasionType.Communion,OccasionType.BabyShower,OccasionType.BridalShower,OccasionType.Graduation,OccasionType.Corporate]
  },
  {
    value:"vintage-rose",
    label:"Rosa Vintage",
    englishLabel:"Vintage Rose",
    description:"Nostálgico, romántico, cálido y personal.",
    group:"natural",
    intensity:"soft",
    audience:["adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Wedding],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.BridalShower,OccasionType.BabyShower,OccasionType.FifteenthBirthday,OccasionType.Baptism]
  },
  {
    value:"champagne-glow",
    label:"Brillo Champagne",
    englishLabel:"Champagne Glow",
    description:"Celebración refinada, luminosa y cálida.",
    group:"formal",
    intensity:"elegant",
    audience:["adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Wedding,OccasionType.WeddingAnniversary],
    compatibleOccasions:[OccasionType.BridalShower,OccasionType.BabyShower,OccasionType.Graduation,OccasionType.Baptism,OccasionType.Communion,OccasionType.Party]
  },
  {
    value:"burgundy-wine",
    label:"Vino Borgoña",
    englishLabel:"Burgundy Wine",
    description:"Profundo, romántico, adulto y sofisticado.",
    group:"formal",
    intensity:"elegant",
    audience:["adults"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Wedding,OccasionType.WeddingAnniversary],
    compatibleOccasions:[OccasionType.Party,OccasionType.Graduation,OccasionType.FifteenthBirthday,OccasionType.BarMitzvah,OccasionType.BatMitzvah]
  },
  {
    value:"black-soft-gold",
    label:"Negro y Dorado",
    englishLabel:"Black & Gold",
    description:"Lujo, gala y celebración nocturna.",
    group:"formal",
    intensity:"elegant",
    audience:["adults"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.WeddingAnniversary,OccasionType.Party],
    compatibleOccasions:[OccasionType.Graduation,OccasionType.Corporate,OccasionType.Wedding,OccasionType.BarMitzvah,OccasionType.BatMitzvah]
  },
  {
    value:"ivory-gold",
    label:"Marfil y Dorado",
    englishLabel:"Ivory & Gold",
    description:"Clásico, limpio, ceremonial y atemporal.",
    group:"formal",
    intensity:"elegant",
    audience:["universal"],
    primaryOccasions:[OccasionType.Wedding,OccasionType.Baptism,OccasionType.Communion],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.Birthday,OccasionType.Graduation,OccasionType.BarMitzvah,OccasionType.BatMitzvah,OccasionType.Corporate]
  },
  {
    value:"pearl-lavender",
    label:"Lavanda Perla",
    englishLabel:"Pearl Lavender",
    description:"Delicado, ceremonial, femenino y luminoso.",
    group:"formal",
    intensity:"soft",
    audience:["kids","teens","adults"],
    primaryOccasions:[OccasionType.FifteenthBirthday,OccasionType.Baptism,OccasionType.Communion],
    compatibleOccasions:[OccasionType.Birthday,OccasionType.Wedding,OccasionType.BridalShower,OccasionType.BabyShower,OccasionType.GenderReveal]
  },
  {
    value:"mediterranean-blue",
    label:"Azul Mediterráneo",
    englishLabel:"Mediterranean Blue",
    description:"Fresco, luminoso, elegante y vacacional.",
    group:"special",
    intensity:"medium",
    audience:["universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Party,OccasionType.Wedding],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.BabyShower,OccasionType.Graduation,OccasionType.Corporate]
  },
  {
    value:"celestial-night",
    label:"Noche Celestial",
    englishLabel:"Celestial Night",
    description:"Mágico, misterioso y sofisticado.",
    group:"special",
    intensity:"elegant",
    audience:["teens","adults"],
    primaryOccasions:[OccasionType.FifteenthBirthday,OccasionType.Birthday],
    compatibleOccasions:[OccasionType.Party,OccasionType.Wedding,OccasionType.WeddingAnniversary,OccasionType.Graduation,OccasionType.BarMitzvah,OccasionType.BatMitzvah]
  },
  {
    value:"modern-editorial",
    label:"Editorial Moderna",
    englishLabel:"Modern Editorial",
    description:"Contemporáneo, minimalista, premium y sobrio.",
    group:"special",
    intensity:"elegant",
    audience:["adults","universal"],
    primaryOccasions:[OccasionType.Birthday,OccasionType.Wedding,OccasionType.Corporate],
    compatibleOccasions:[OccasionType.WeddingAnniversary,OccasionType.Graduation,OccasionType.Party,OccasionType.Baptism,OccasionType.Communion]
  },
  {
  value:"summer-splash",
  label:"Verano Refrescante",
  englishLabel:"Summer Splash",
  description:"Luminoso, fresco, alegre y espontáneo.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.KidsBirthday,OccasionType.Party],
  compatibleOccasions:[OccasionType.Graduation,OccasionType.BabyShower,OccasionType.GenderReveal,OccasionType.WeddingAnniversary]
},
{
  value:"retro-picnic",
  label:"Picnic Retro",
  englishLabel:"Retro Picnic",
  description:"Alegre, nostálgico, informal y social.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.KidsBirthday,OccasionType.Party],
  compatibleOccasions:[OccasionType.Graduation,OccasionType.WeddingAnniversary,OccasionType.Wedding]
},
{
  value:"neon-soft",
  label:"Neón Suave",
  englishLabel:"Neon Soft",
  description:"Juvenil, moderno, energético y tecnológico sin estridencia.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["teens","adults"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.FifteenthBirthday,OccasionType.Party],
  compatibleOccasions:[OccasionType.Graduation]
},
{
  value:"tropical-garden",
  label:"Jardín Tropical",
  englishLabel:"Tropical Garden",
  description:"Natural, alegre, fresco y festivo.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.Party,OccasionType.Wedding],
  compatibleOccasions:[OccasionType.BabyShower,OccasionType.GenderReveal,OccasionType.WeddingAnniversary]
},
{
  value:"sunset-party",
  label:"Fiesta al Atardecer",
  englishLabel:"Sunset Party",
  description:"Cálido, divertido, expresivo y social.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["teens","adults","universal"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.Party,OccasionType.FifteenthBirthday],
  compatibleOccasions:[OccasionType.Graduation,OccasionType.WeddingAnniversary]
},
{
  value:"candy-festival",
  label:"Festival de Caramelos",
  englishLabel:"Candy Festival",
  description:"Dulce, alegre, juvenil y dinámico.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens"],
  primaryOccasions:[OccasionType.KidsBirthday,OccasionType.Birthday,OccasionType.FifteenthBirthday],
  compatibleOccasions:[OccasionType.Party,OccasionType.GenderReveal]
},
{
  value:"ocean-pop",
  label:"Océano Pop",
  englishLabel:"Ocean Pop",
  description:"Fresco, moderno, veraniego y optimista.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.Party,OccasionType.Wedding],
  compatibleOccasions:[OccasionType.Graduation,OccasionType.BabyShower,OccasionType.GenderReveal]
},
{
  value:"lime-berry",
  label:"Lima y Frutos Rojos",
  englishLabel:"Lime & Berry",
  description:"Audaz, juvenil, fresco y contemporáneo.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["teens","adults"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.FifteenthBirthday,OccasionType.Party],
  compatibleOccasions:[OccasionType.Graduation]
},
{
  value:"color-fiesta",
  label:"Fiesta de Colores",
  englishLabel:"Color Fiesta",
  description:"Alegre, dinámica, festiva y universal.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.KidsBirthday,OccasionType.Party],
  compatibleOccasions:[OccasionType.Graduation,OccasionType.BabyShower,OccasionType.GenderReveal,OccasionType.FifteenthBirthday]
},
{
  value:"rainbow-celebration",
  label:"Celebración Arcoíris",
  englishLabel:"Rainbow Celebration",
  description:"Alegre, inclusivo, optimista y claramente celebratorio.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[OccasionType.Birthday,OccasionType.KidsBirthday,OccasionType.Party],
  compatibleOccasions:[OccasionType.FifteenthBirthday,OccasionType.Graduation,OccasionType.BabyShower,OccasionType.GenderReveal]
},

{
  value:"soft-blossom",
  label:"Flores Suaves",
  englishLabel:"Soft Blossom",
  description:"Delicado, dulce, luminoso y acogedor.",
  group:"soft",
  intensity:"soft",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.BabyShower,
    OccasionType.Baptism,
    OccasionType.Communion,
    OccasionType.Wedding
  ],
  compatibleOccasions:[
    OccasionType.WeddingAnniversary,
    OccasionType.GenderReveal,
    OccasionType.Anniversary,
    OccasionType.FifteenthBirthday
  ]
},
{
  value:"coral-aqua-party",
  label:"Fiesta Coral y Aqua",
  englishLabel:"Coral Aqua Party",
  description:"Alegre, energética, colorida y celebratoria sin ser estridente.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.FifteenthBirthday,
    OccasionType.Party,
    OccasionType.Graduation
  ],
  compatibleOccasions:[
    OccasionType.BabyShower,
    OccasionType.GenderReveal,
    OccasionType.WeddingAnniversary,
    OccasionType.Anniversary
  ]
},
{
  value:"sage",
  label:"Salvia",
  englishLabel:"Sage",
  description:"Sofisticado, refinado, adulto y premium.",
  group:"elegant",
  intensity:"elegant",
  audience:["adults","universal"],
  primaryOccasions:[
    OccasionType.Wedding,
    OccasionType.WeddingAnniversary,
    OccasionType.Anniversary,
    OccasionType.Graduation,
    OccasionType.Corporate
  ],
  compatibleOccasions:[
    OccasionType.Birthday,
    OccasionType.Party,
    OccasionType.FifteenthBirthday,
    OccasionType.Communion
  ]
},

{
  value:"pastel-sunrise",
  label:"Amanecer Pastel",
  englishLabel:"Pastel Sunrise",
  description:"Cálido, alegre, delicado y acogedor.",
  group:"soft",
  intensity:"soft",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.BabyShower,
    OccasionType.GenderReveal
  ],
  compatibleOccasions:[
    OccasionType.Party,
    OccasionType.FifteenthBirthday,
    OccasionType.Wedding,
    OccasionType.Baptism,
    OccasionType.Communion,
    OccasionType.Anniversary
  ]
},

{
  value:"pastel-ocean",
  label:"Océano Pastel",
  englishLabel:"Pastel Ocean",
  description:"Fresco, luminoso, tranquilo y liviano.",
  group:"soft",
  intensity:"soft",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.BabyShower,
    OccasionType.GenderReveal,
    OccasionType.Baptism
  ],
  compatibleOccasions:[
    OccasionType.KidsBirthday,
    OccasionType.Communion,
    OccasionType.Wedding,
    OccasionType.Party,
    OccasionType.Graduation,
    OccasionType.Anniversary
  ]
},

{
  value:"pastel-meadow",
  label:"Pradera Pastel",
  englishLabel:"Pastel Meadow",
  description:"Natural, dulce, cálido y acogedor.",
  group:"soft",
  intensity:"soft",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.BabyShower,
    OccasionType.Baptism
  ],
  compatibleOccasions:[
    OccasionType.Communion,
    OccasionType.GenderReveal,
    OccasionType.Wedding,
    OccasionType.WeddingAnniversary,
    OccasionType.Anniversary,
    OccasionType.Party
  ]
},

{  value:"pastel-lavender",
  label:"Lavanda Pastel",
  englishLabel:"Pastel Lavender",
  description:"Mágico, juvenil, delicado y especial.",
  group:"soft",
  intensity:"soft",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.FifteenthBirthday,
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.BabyShower
  ],
  compatibleOccasions:[
    OccasionType.GenderReveal,
    OccasionType.Communion,
    OccasionType.Baptism,
    OccasionType.Graduation,
    OccasionType.Wedding,
    OccasionType.Party
  ]
},

{  value:"pastel-candy2",
  label:"Dulces Pastel",
  englishLabel:"Pastel Candy",
  description:"Dulce, divertido y festivo sin ser infantil.",
  group:"soft",
  intensity:"soft",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.KidsBirthday,
    OccasionType.Birthday,
    OccasionType.BabyShower,
    OccasionType.GenderReveal,
    OccasionType.Party
  ],
  compatibleOccasions:[
    OccasionType.FifteenthBirthday,
    OccasionType.Baptism,
    OccasionType.Communion,
    OccasionType.Graduation
  ]
},

{  value:"coral-festive",
  label:"Coral Festivo",
  englishLabel:"Coral Festive",
  description:"Alegre, cálido, energético y celebratorio.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.Party,
    OccasionType.Graduation
  ],
  compatibleOccasions:[
    OccasionType.FifteenthBirthday,
    OccasionType.BabyShower,
    OccasionType.GenderReveal,
    OccasionType.Anniversary
  ]
},

{  value:"berry-celebration",
  label:"Frambuesa Celebración",
  englishLabel:"Berry Celebration",
  description:"Juvenil, alegre, moderno y expresivo.",
  group:"vibrant",
 intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.FifteenthBirthday,
    OccasionType.Party
  ],
  compatibleOccasions:[
    OccasionType.Graduation,
    OccasionType.BabyShower,
    OccasionType.GenderReveal,
    OccasionType.Anniversary
  ]
},

{
  value:"summer-blue",
  label:"Azul Verano",
  englishLabel:"Summer Blue",
  description:"Fresco, optimista, luminoso y contemporáneo.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.Party,
    OccasionType.Graduation
  ],
  compatibleOccasions:[
    OccasionType.KidsBirthday,
    OccasionType.FifteenthBirthday,
    OccasionType.Anniversary,
    OccasionType.WeddingAnniversary,
    OccasionType.Corporate
  ]
},

{  value:"elegant-plum",
  label:"Ciruela Elegante",
  englishLabel:"Elegant Plum",
  description:"Sofisticado, juvenil, festivo y refinado.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["teens","adults","universal"],
  primaryOccasions:[
    OccasionType.FifteenthBirthday,
    OccasionType.Birthday,
    OccasionType.Party,
    OccasionType.Graduation
  ],
  compatibleOccasions:[
    OccasionType.WeddingAnniversary,
    OccasionType.Anniversary,
    OccasionType.Wedding,
    OccasionType.Communion
  ]
},

{  value:"tropical-green",
  label:"Verde Tropical",
  englishLabel:"Tropical Green",
  description:"Fresco, natural, alegre y relajado.",
  group:"vibrant",
  intensity:"vibrant",
  audience:["kids","teens","adults","universal"],
  primaryOccasions:[
    OccasionType.Birthday,
    OccasionType.KidsBirthday,
    OccasionType.Party,
    OccasionType.Graduation
  ],
  compatibleOccasions:[
    OccasionType.FifteenthBirthday,
    OccasionType.Anniversary,
    OccasionType.BabyShower,
    OccasionType.GenderReveal,
    OccasionType.Corporate
  ]
},

{
  value:"black-gold",
  label:"Negro y Oro",
  englishLabel:"Black & Gold",
  description:"Elegante, sofisticado, nocturno y exclusivo, con negro profundo y detalles dorados.",
  group:"special",
  intensity:"elegant",
  audience:["teens","adults","universal"],
  primaryOccasions:[
    OccasionType.FifteenthBirthday,
    OccasionType.Birthday,
    OccasionType.Party,
    OccasionType.Wedding,
    OccasionType.WeddingAnniversary,
    OccasionType.Anniversary
  ],
  compatibleOccasions:[
    OccasionType.Graduation,
    OccasionType.Communion,
    OccasionType.BarMitzvah,
    OccasionType.BatMitzvah,
    OccasionType.Corporate
  ]
},
  
];

/** FIN-PALETAS */

/* =========================
   ✍️ FONTS
========================= */

/** INICIO-FONTS */

export type AppearanceFont = {
  value: string;
  label: string;
  mobileScale: number;
  desktopScale: number;
  bodyFontValue: string;
  bodyFontMobileScale: number;
  bodyFontDesktopScale: number;
  decorative: boolean;
};

export const APPEARANCE_FONTS: AppearanceFont[] = [
  {
    value: "wixMadeforText",
    label: "Wix Madefor Text",
    mobileScale: 0.7,
    desktopScale: 0.7,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "poppins",
    label: "Poppins",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "inter",
    label: "Inter",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "roboto",
    label: "Roboto",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "greatVibes",
    label: "Great Vibes",
    mobileScale: 0.9,
    desktopScale: 0.9,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "pinyonScript",
    label: "Pinyon Script",
    mobileScale: 0.9,
    desktopScale: 0.9,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "italianno",
    label: "Italianno",
    mobileScale: 1.1,
    desktopScale: 1.1,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "cormorantGaramond",
    label: "Cormorant Garamond",
    mobileScale: 0.7,
    desktopScale: 0.7,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "playfairDisplay",
    label: "Playfair Display",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "dmSerifDisplay",
    label: "DM Serif Display",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "libreBaskerville",
    label: "Libre Baskerville",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "lora",
    label: "Lora",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "montserrat",
    label: "Montserrat",
    mobileScale: 0.6,
    desktopScale: 0.7,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "raleway",
    label: "Raleway",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "caveat",
    label: "Caveat",
    mobileScale: 0.95,
    desktopScale: 0.95,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "dancingScript",
    label: "Dancing Script",
    mobileScale: 0.8,
    desktopScale: 1,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "parisienne",
    label: "Parisienne",
    mobileScale: 0.88,
    desktopScale: 0.88,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "cinzelDecorative",
    label: "Cinzel Decorative",
    mobileScale: 0.65,
    desktopScale: 0.65,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "orbitron",
    label: "Orbitron",
    mobileScale: 0.6,
    desktopScale: 0.6,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  },
  {
    value: "monoton",
    label: "Monoton",
    mobileScale: 0.55,
    desktopScale: 0.55,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "bungee",
    label: "Bungee",
    mobileScale: 0.5,
    desktopScale: 0.5,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: true
  },
  {
    value: "specialElite",
    label: "Special Elite",
    mobileScale: 0.7,
    desktopScale: 0.7,
    bodyFontValue: "wixMadeforText",
    bodyFontMobileScale: 1,
    bodyFontDesktopScale: 1,
    decorative: false
  }
];

/** FIN-FONTS */

/* =========================
   ✨ ANIMATIONS
========================= */

export type AnimationInfo = {
  value: string | number;
  label: string;
  file: string | undefined;
  mobileTopValue: string;
  desktopTopValue: string;
  mobileLeftValue: string;
  desktopLeftValue: string;
  opacity:string;
  mobileWidth:string;
  mobileHeight:string;
	desktopWidth:string;
  desktopHeight:string;
  filter:string;
  transform:string;
  speed:string;
};

/** INICIO-ANIMACIONES */

export const APPEARANCE_ANIMATIONS: AnimationInfo[] = [
  // filter:"blur(var(--hero-animation-blur, 0px))",
  // transform:"scale(var(--hero-animation-scale, 1))",
  {
    value: 0,
    label: "Sin animación",
    file: undefined,
    mobileTopValue: "0",
    desktopTopValue: "0",
    mobileLeftValue:"0",
    desktopLeftValue:"0",
    opacity:"",
    mobileWidth:"0",
    mobileHeight:"0",
	  desktopWidth:"0",
    desktopHeight:"0",
    filter:"",
    transform:"",
    speed:"1",
  },
  {
    value: 1,
    label: "Confetti 1",
    file: "/animations/confetti.lottie",
    mobileTopValue: "-10%",
    desktopTopValue: "-10%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.75",
    mobileWidth: "100%",
    mobileHeight: "90%",
    desktopWidth: "100%",
    desktopHeight: "90%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"0.8",
  },
  {
    value: 9,
    label: "Confetti 2",
    file: "/animations/confetti2.lottie",
    mobileTopValue: "-10%",
    desktopTopValue: "-10%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.75",
    mobileWidth: "100%",
    mobileHeight: "90%",
    desktopWidth: "100%",
    desktopHeight: "90%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"0.7",
  },
  {
    value: 21,
    label: "Confetti 3",
    file: "/animations/confetti3.lottie",
    mobileTopValue: "0%",
    desktopTopValue: "0%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "1",
    mobileWidth: "100%",
    mobileHeight: "100%",
    desktopWidth: "100%",
    desktopHeight: "100%",
    filter: "",
    transform: "",
    speed:"0.4",
  },
  {
    value: 22,
    label: "Fuegos Artificiales",
    file: "/animations/fireworks1.lottie",
    mobileTopValue: "0%",
    desktopTopValue: "0%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "1",
    mobileWidth: "120%",
    mobileHeight: "120%",
    desktopWidth: "120%",
    desktopHeight: "120%",
    filter: "",
    transform: "",
    speed:"0.5",
  },
  {
    value: 19,
    label: "Estrellas titilantes",
    file: "/animations/stars_rain1.lottie",
    mobileTopValue: "0%",
    desktopTopValue: "0%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "1",
    mobileWidth: "100%",
    mobileHeight: "120%",
    desktopWidth: "100%",
    desktopHeight: "120%",
    filter: "",
    transform: "",
    speed:"1",
  },
  {
    value: 20,
    label: "Explosión de estrellas",
    file: "/animations/stars_rain2.lottie",
    mobileTopValue: "-5%",
    desktopTopValue: "-10%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.99",
    mobileWidth: "140%",
    mobileHeight: "180%",
    desktopWidth: "120%",
    desktopHeight: "140%",
    filter: "",
    transform: "",
    speed:"0.5",
  },
  {
    value: 12,
    label: "Globos",
    file: "/animations/ballons.lottie",
    mobileTopValue: "-10%",
    desktopTopValue: "-10%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.75",
    mobileWidth: "100%",
    mobileHeight: "90%",
    desktopWidth: "100%",
    desktopHeight: "90%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"0.8",
  },
  {
    value: 23,
    label: "Corazones mariposa",
    file: "/animations/butterfly_hearts.lottie",
    mobileTopValue: "-20%",
    desktopTopValue: "10%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "1",
    mobileWidth: "100%",
    mobileHeight: "130%",
    desktopWidth: "70%",
    desktopHeight: "80%",
    filter: "",
    transform: "",
    speed:"0.4",
  },
  
  {
    value: 3,
    label: "Gato con globos",
    file: "/animations/cat_with_baloons.lottie",
    mobileTopValue: "32%",
    desktopTopValue: "22%",
    mobileLeftValue: "-8%",
    desktopLeftValue: "-8%",
    opacity: "0.5",
    mobileWidth: "71%",
    mobileHeight: "73%",
    desktopWidth: "71%",
    desktopHeight: "73%",
    filter: "",
    transform: "",
    speed:"0.8",
  },
  {
    value: 13,
    label: "Party 1",
    file: "/animations/party.lottie",
    mobileTopValue: "45%",
    desktopTopValue: "40%",
    mobileLeftValue: "-1%",
    desktopLeftValue: "-5%",
    opacity: "1",
    mobileWidth: "44%",
    mobileHeight: "40%",
    desktopWidth: "44%",
    desktopHeight: "40%",
    filter: "",
    transform: "",
    speed:"0.8",
  },
  {
    value: 14,
    label: "Party 2",
    file: "/animations/party2.lottie",
    mobileTopValue: "50%",
    desktopTopValue: "44%",
    mobileLeftValue: "0%",
    desktopLeftValue: "0%",
    opacity: "0.6",
    mobileWidth: "82%",
    mobileHeight: "44%",
    desktopWidth: "82%",
    desktopHeight: "44%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"0.7",
  }, // translateX(-50%) scale(1.1)
  {
    value: 15,
    label: "Party 3",
    file: "/animations/party3.lottie",
    mobileTopValue: "5%",
    desktopTopValue: "8%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "1",
    mobileWidth: "120%",
    mobileHeight: "120%",
    desktopWidth: "120%",
    desktopHeight: "120%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"1",
  },
  {
    value: 5,
    label: "Pajaritos",
    file: "/animations/birds.lottie",
    mobileTopValue: "15%",
    desktopTopValue: "15%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "1",
    mobileWidth: "100%",
    mobileHeight: "100%",
    desktopWidth: "100%",
    desktopHeight: "100%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"1",
  },
  {
    value: 6,
    label: "Solcito",
    file: "/animations/sun.lottie",
    mobileTopValue: "5%",
    desktopTopValue: "5%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.75",
    mobileWidth: "100%",
    mobileHeight: "100%",
    desktopWidth: "100%",
    desktopHeight: "100%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"1",
  },
 {
    value: 2,
    label: "Corazones flotando",
    file: "/animations/floating_hearts.lottie",
    mobileTopValue: "29%",
    desktopTopValue: "29%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.75",
    mobileWidth: "84%",
    mobileHeight: "82%",
    desktopWidth: "84%",
    desktopHeight: "82%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"0.8",
  },
  
  {
    value: 4,
    label: "Mensaje de amor 1",
    file: "/animations/love_message_burst.lottie",
    mobileTopValue: "-7%",
    desktopTopValue: "-7%",
    mobileLeftValue: "55%",
    desktopLeftValue: "55%",
    opacity: "1",
    mobileWidth: "52%",
    mobileHeight: "47%",
    desktopWidth: "52%",
    desktopHeight: "47%",
    filter: "",
    transform: "",
    speed:"1",
  },
  {
    value: 18,
    label: "Mensaje de amor 2",
    file: "/animations/love_message.lottie",
    mobileTopValue: "30%",
    desktopTopValue: "19%",
    mobileLeftValue: "-1%",
    desktopLeftValue: "-1%",
    opacity: "1",
    mobileWidth: "83%",
    mobileHeight: "81%",
    desktopWidth: "83%",
    desktopHeight: "81%",
    filter: "",
    transform: "",
    speed:"0.7",
  },
  
  {
    value: 8,
    label: "Boda",
    file: "/animations/wedding.lottie",
     mobileTopValue: "24%",
    desktopTopValue: "24%",
    mobileLeftValue: "7%",
    desktopLeftValue: "7%",
    opacity: "0.9",
    mobileWidth: "100%",
    mobileHeight: "100%",
    desktopWidth: "100%",
    desktopHeight: "100%",
    filter: "",
    transform: "",
    speed:"0.8",
  },
  {
    value: 10,
    label: "BBQ",
    file: "/animations/bbq.lottie",
    mobileTopValue: "40%",
    desktopTopValue: "34%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.8",
    mobileWidth: "59%",
    mobileHeight: "50%",
    desktopWidth: "59%",
    desktopHeight: "50%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"1",
  },
  {
    value: 11,
    label: "Brindis",
    file: "/animations/cheers.lottie",
    mobileTopValue: "30%",
    desktopTopValue: "25%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.8",
    mobileWidth: "85%",
    mobileHeight: "85%",
    desktopWidth: "85%",
    desktopHeight: "85%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"0.8",
  },
  {
    value: 16,
    label: "Girl",
    file: "/animations/girl1.lottie",
    mobileTopValue: "35%",
    desktopTopValue: "25%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "1",
    mobileWidth: "73%",
    mobileHeight: "71%",
    desktopWidth: "73%",
    desktopHeight: "71%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"1",
  },
  {
    value: 17,
    label: "Guirnalda",
    file: "/animations/girland.lottie",
    mobileTopValue: "5%",
    desktopTopValue: "-10%",
    mobileLeftValue: "50%",
    desktopLeftValue: "50%",
    opacity: "0.9",
    mobileWidth: "100%",
    mobileHeight: "100%",
    desktopWidth: "100%",
    desktopHeight: "100%",
    filter: "",
    transform: "translateX(-50%)",
    speed:"1",
  },
];

/** FIN-ANIMACIONES */

export function getAnimationInfo(animationType: number): AnimationInfo {
  const animation = APPEARANCE_ANIMATIONS.find(
    (item) => item.value === animationType
  );

  // Si no encuentra la animación recibida por parámetro, retorna la opción por defecto (Sin animación)
  return animation || APPEARANCE_ANIMATIONS[0];
}


/*export function getAnimationFile( animationType: number ) {
  if (animationType===0)
    return undefined;
  switch (animationType) {
    case 1:
      return "/animations/confetti.lottie";
    case 2:
      return "/animations/floating_hearts.lottie";
    case 3:
      return "/animations/cat_with_baloons.lottie";
    default:
      return undefined;
  }
}*/

/* =========================
   🎯 BACKGROUND MOTIVES
========================= */

export type BackgroundMotiveInfo = {
  value: string | number;
  label: string;
  url: string | undefined;
  backgroundSize: string;
  opacity:string;
  repeat:string;
  positionX:string;
  positionY:string;
};

/** INICIO-BACKGROUNDS */

export const APPEARANCE_BACKGROUNDS: BackgroundMotiveInfo[] = [
  {
    value:"none",
    label:"Sin fondo",
    url:"",
    backgroundSize:"0",
    opacity:"0",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "guirnald1",
    label: "Guirnalda 1",
    url:"/background_motive/guirnald1.png",
    backgroundSize:"100%",
    opacity:"1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
  {
    value: "guirnald2",
    label: "Guirnalda 2",
    url:"/background_motive/guirnald2.png",
    backgroundSize:"100%",
    opacity:"1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
  {
    value: "guirnald3",
    label: "Guirnalda 3",
    url:"/background_motive/guirnald3.png",
    backgroundSize:"80%",
    opacity:"1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"-2%",
  },
  {
    value: "guirnald4",
    label: "Guirnalda 4",
    url:"/background_motive/guirnald4.png",
    backgroundSize:"100%",
    opacity:"0.7",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
  {
    value: "guirnald5",
    label: "Guirnalda 5",
    url:"/background_motive/guirnald5.png",
    backgroundSize:"100%",
    opacity:".0.4",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"-5%",
  },
  {
    value: "guirnald6",
    label: "Guirnalda 6",
    url:"/background_motive/guirnald6.png",
    backgroundSize:"90%",
    opacity:"1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"-20%",
  },

  {
    value: "guirnald7",
    label: "Guirnalda 7",
    url:"/background_motive/guirnald7.png",
    backgroundSize:"100%",
    opacity:"1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"-5%",
  },
  {
    value: "guirnald8",
    label: "Guirnalda 8",
    url:"/background_motive/guirnald8.png",
    backgroundSize:"100%",
    opacity:"0.2",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"-30%",
  },

   {
    value: "baloons_arch1",
    label: "Arco de globos",
    url:"/background_motive/baloons_arch1.svg",
    backgroundSize:"100%",
    opacity:"0.5",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"10%",
  },
   
   {
    value: "baloons_arch3",
    label: "Arco de corazones",
    url:"/background_motive/baloons_arch3.svg",
    backgroundSize:"100%",
    opacity:"0.9",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
   {
    value: "baloons_arch4",
    label: "Arco de princesa 1",
    url:"/background_motive/baloons_arch4.png",
    backgroundSize:"150%",
    opacity:"0.9",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
 {
    value: "baloons_arch8",
    label: "Arco de princesa 2",
    url:"/background_motive/baloons_arch8.svg",
    backgroundSize:"100%",
    opacity:"0.7",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
   {
    value: "baloons_arch7",
    label: "Pelotas de Fútbol 1",
    url:"/background_motive/baloons_arch7.svg",
    backgroundSize:"100%",
    opacity:"0.7",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
   {
    value: "baloons_arch9",
    label: "Pelotas de fútbol 2",
    url:"/background_motive/baloons_arch9.svg",
    backgroundSize:"100%",
    opacity:"0.9",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
    {
    value: "baloons_arch10",
    label: "Arco festivo 1",
    url:"/background_motive/baloons_arch10.svg",
    backgroundSize:"100%",
    opacity:"0.9",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
  {
    value: "baloons_arch11",
    label: "Arco festivo 2",
    url:"/background_motive/baloons_arch11.png",
    backgroundSize:"100%",
    opacity:"0.9",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
 {
    value: "wedding_arch1",
    label: "Arco de Boda 1",
    url:"/background_motive/wedding_arch1.png",
    backgroundSize:"100%",
    opacity:"1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
  {
    value: "wedding_arch2",
    label: "Arco de Boda 2",
    url:"/background_motive/wedding_arch2.png",
    backgroundSize:"130%",
    opacity:"1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"-20%",
  },
   {
    value: "wedding-arch1",
    label: "Arco de Boda 3",
    url:"/background_motive/wedding-arch1.png",
    backgroundSize:"140%",
    opacity:"0.4",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"-10%",
  },
  {
    value: "wedding1",
    label: "Anillos",
    url:"/background_motive/wedding1.jpg",
    backgroundSize:"40%",
    opacity:"0.2",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
   {
    value: "baloons1",
    label: "Globos 1",
    url:"/background_motive/baloons1.svg",
    backgroundSize:"80%",
    opacity:"0.1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
  {
    value: "baloons2",
    label: "Globos 2",
    url:"/background_motive/baloons2.jpg",
    backgroundSize:"70%",
    opacity:"0.1",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  
  {
    value: "cat_birthday",
    label: "Gato-cumpleaños",
    url:"/background_motive/cat_birthday.jpg",
    backgroundSize:"20%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "dog_birthday",
    label: "Perro-cumpleaños",
    url:"/background_motive/dog_birthday.jpg",
    backgroundSize:"20%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "confetti1",
    label: "Confetti 1",
    url:"/background_motive/confetti1.jpg",
    backgroundSize:"70%",
    opacity:"0.1",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "confetti2",
    label: "Confetti 2",
    url:"/background_motive/confetti2.jpg",
    backgroundSize:"100%",
    opacity:"0.2",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "bbq1",
    label: "BBQ",
    url:"/background_motive/bbq1.svg",
    backgroundSize:"100%",
    opacity:"0.1",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"10%",
  },
  {
    value: "beers1",
    label: "Jarra de Cervezas",
    url:"/background_motive/beers1.jpg",
    backgroundSize:"100%",
    opacity:"0.1",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "dino1",
    label: "Dinosaurio",
    url:"/background_motive/dino1.jpg",
    backgroundSize:"20%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "flowers1",
    label: "Flores 1",
    url:"/background_motive/flowers1.jpg",
    backgroundSize:"40%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "flowers2",
    label: "Flores 2",
    url:"/background_motive/flowers2.jpg",
    backgroundSize:"40%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "flowers3",
    label: "Flores 3",
    url:"/background_motive/flowers3.jpg",
    backgroundSize:"20%",
    opacity:"0.4",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "flowers4",
    label: "Flores 4",
    url:"/background_motive/flowers4.png",
    backgroundSize:"50%",
    opacity:"0.4",
    repeat:"no-repeat",
    positionX:"center",
    positionY:"0%",
  },
 
  {
    value: "gift1",
    label: "Regalo",
    url:"/background_motive/gift1.svg",
    backgroundSize:"100%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  
  {
    value: "hearts1",
    label: "Corazones 1",
    url:"/background_motive/hearts1.jpg",
    backgroundSize:"120%",
    opacity:"0.1",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "hearts2",
    label: "Corazones 2",
    url:"/background_motive/hearts2.jpg",
    backgroundSize:"30%",
    opacity:"0.4",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "hearts3",
    label: "Corazones 3",
    url:"/background_motive/hearts3.jpg",
    backgroundSize:"20%",
    opacity:"0.2",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "kids1",
    label: "Kids 1",
    url:"/background_motive/kids1.jpg",
    backgroundSize:"55%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
 
  {
    value: "kids2",
    label: "Kids 2",
    url:"/background_motive/kids2.jpg",
    backgroundSize:"50%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },


  {
    value: "koala_birthday",
    label: "Koala Cumpleaños",
    url:"/background_motive/koala_birthday.jpg",
    backgroundSize:"40%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "love1",
    label: "Amor",
    url:"/background_motive/love1.jpg",
    backgroundSize:"30%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "making_toast1",
    label: "Brindis",
    url:"/background_motive/making_toast1.jpg",
    backgroundSize:"35%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "mascarade1",
    label: "Máscara",
    url:"/background_motive/mascarade1.jpg",
    backgroundSize:"35%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "party1",
    label: "Party 1",
    url:"/background_motive/party1.jpg",
    backgroundSize:"70%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "party2",
    label: "Party 2",
    url:"/background_motive/party2.jpg",
    backgroundSize:"60%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "party3",
    label: "Party 3",
    url:"/background_motive/party3.jpg",
    backgroundSize:"40%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "party4",
    label: "Party 4",
    url:"/background_motive/party4.jpg",
    backgroundSize:"25%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "princess1",
    label: "Princesa 1",
    url:"/background_motive/princess1.svg",
    backgroundSize:"80%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "princess2",
    label: "Princesa 2",
    url:"/background_motive/princess2.jpg",
    backgroundSize:"35%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "princess3",
    label: "Princesa 3",
    url:"/background_motive/princess3.jpg",
    backgroundSize:"70%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "prince1",
    label: "Principe",
    url:"/background_motive/prince1.jpg",
    backgroundSize:"40%",
    opacity:"0.3",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "rainbow1",
    label: "Arco Iris",
    url:"/background_motive/rainbow1.jpg",
    backgroundSize:"35%",
    opacity:"0.1",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "soccer_ball1",
    label: "Pelotas de fútbol",
    url:"/background_motive/soccer_ball1.jpg",
    backgroundSize:"80%",
    opacity:"0.1",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "stars1",
    label: "Estrellas",
    url:"/background_motive/stars1.svg",
    backgroundSize:"100%",
    opacity:"0.2",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },
  {
    value: "toys1",
    label: "Juguetes",
    url:"/background_motive/toys1.svg",
    backgroundSize:"100%",
    opacity:"0.2",
    repeat:"repeat",
    positionX:"0",
    positionY:"0",
  },

];

/** FIN-BACKGROUNDS */

export function getBackgroundMotiveInfo(name: string): BackgroundMotiveInfo {
  const background = APPEARANCE_BACKGROUNDS.find(
    (item) => item.value === name
  );

  // Si no encuentra la animación recibida por parámetro, retorna la opción por defecto (Sin animación)
  return background || APPEARANCE_BACKGROUNDS[0];
}

/* =========================
   🎨 BACKGROUND MAPPER
========================= */
'nj '
/*export function getBackgroundMotiveProps(
  motive: string
) {
  switch (motive) {
    case "none":
      return {
        url: "/",
        backgroundSize: "0",
      };
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

    case "stars1":
      return {
        url: "/background_motive/stars1.svg",
        backgroundSize: "100%",
      };

    default:
      return {
        url: "/background_motive/heart.jpg",
        backgroundSize: "120%",
      };
  }
}*/

export function getBackgroundMotiveNameByUrl(url: string): string {
  if (!url) return "none"; // Valor por defecto si no hay URL

  // 1. Obtenemos el nombre del archivo con su extensión (ej: "soccer_ball.jpg")
  const fileNameWithExtension = url.substring(url.lastIndexOf("/") + 1);

  // 2. Le quitamos la extensión (ej: ".jpg" o ".png") para quedarnos solo con "soccer_ball"
  const motiveName = fileNameWithExtension.split(".")[0];

  // 3. Opcional: Si por alguna razón el nombre extraído no es válido,
  // podés definir una lista de nombres permitidos o simplemente retornar el valor
  return motiveName || "none";
}

export function getDefaultAppearanceTemplate(
  occasionType: OccasionType
): AppearanceTemplate {
  return (
    APPEARANCE_TEMPLATES.find(template =>
      template.occasionTypeDefaults.includes(occasionType)
    ) ??
    APPEARANCE_TEMPLATES.find(template =>
      template.occasionTypeDefaults.length === 0
    ) ??
    APPEARANCE_TEMPLATES[0]
  );
}

/* =========================
   ✨ ANIMATION MAPPER
========================= */

/*export function getAnimation(
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
}*/