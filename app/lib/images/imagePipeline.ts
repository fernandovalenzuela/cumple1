// import sharp from "sharp";
import { mkdir,writeFile } from "node:fs/promises";
import { dirname,join } from "node:path";
import { unlink } from "node:fs/promises";
import sharp from "@/lib/images/sharp";

const MAX_WIDTH=1600;
const MAX_HEIGHT=1600;
const THUMB_WIDTH=500;
const THUMB_HEIGHT=500;
const WEBP_QUALITY=82;
const THUMB_QUALITY=74;

export async function processImage(file:File,destination:string,thumbnailDestination?:string){


  /*console.log("Antes de console.log require.cache");
  console.log(require.cache[require.resolve("sharp")] ? "CACHE" : "NO CACHE");
  console.log("Antes de require sharp");
  console.log(require.resolve("sharp"));
  const sharp = require("sharp");
  console.log("Despues de require sharp");
  console.log(require.cache[require.resolve("sharp")] ? "CACHE" : "NO CACHE");
  console.log("Despues");*/

  if(!file.type.startsWith("image/"))
    throw new Error("Archivo inválido.");
  const buffer=Buffer.from(await file.arrayBuffer());
  const image=sharp(buffer).rotate().resize({width:MAX_WIDTH,height:MAX_HEIGHT,fit:"inside",withoutEnlargement:true});
  await mkdir(dirname(destination),{recursive:true});
  await writeFile(destination,await image.clone().webp({quality:WEBP_QUALITY,effort:6}).toBuffer());
  if(!thumbnailDestination)
    return;
  await mkdir(dirname(thumbnailDestination),{recursive:true});
  await writeFile(thumbnailDestination,await image.clone().resize({width:THUMB_WIDTH,height:THUMB_HEIGHT,fit:"cover",position:"attention"}).webp({quality:THUMB_QUALITY,effort:6}).toBuffer());
}

export function getEventImagePath(eventId:number,name:string){
  return join(process.cwd(),"public","events",String(eventId),`${name}.webp`);
}

export function getEventThumbnailPath(eventId:number,name:string){
  return join(process.cwd(),"public","events",String(eventId),"thumbs",`${name}.webp`);
}

export async function deleteImage(image:string,thumbnail?:string){
  try{
    await unlink(image);
  }catch{}
  if(!thumbnail)
    return;
  try{
    await unlink(thumbnail);
  }catch{}
}