import { Inter, Lusitana, Roboto, Great_Vibes, Pinyon_Script, Italianno, Wix_Madefor_Text, Poppins } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const roboto = Roboto({
  subsets: ['latin'],
});

export const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: "400", 
});

export const pinyonScript = Pinyon_Script({
  subsets: ['latin'],
  weight: "400", 
});

export const italianno = Italianno({
  subsets: ['latin'],
  weight: "400", 
});

export const wixMadeforText = Wix_Madefor_Text({
  subsets: ['latin'],
  weight: "400", 
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});


export const fontMap = {
  "inter": inter,
  "roboto": roboto,
  "greatVibes": greatVibes,
  "wixMadeforText": wixMadeforText,
  "poppins": poppins, 
  "italianno": italianno,

};;