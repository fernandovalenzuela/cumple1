import sharp from "@/lib/images/sharp";

import { getImageStorage } from "./imageStorageProvider";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const THUMB_WIDTH = 400;
const THUMB_HEIGHT = 400;
const WEBP_QUALITY = 78;
const THUMB_QUALITY = 70;

export async function processImage(
  file: File,
  destination: string,
  thumbnailDestination?: string
) {
  if (!file.type.startsWith("image/"))
    throw new Error("Archivo inválido.");

  const buffer = Buffer.from(await file.arrayBuffer());

  const image = sharp(buffer)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    });

  const storage = getImageStorage();

  const imageBuffer = await image
    .clone()
    .webp({
      quality: WEBP_QUALITY,
      effort: 6,
    })
    .toBuffer();

  await storage.write(
    destination,
    imageBuffer,
    "image/webp"
  );

  if (!thumbnailDestination)
    return;

  const thumbnailBuffer = await image
    .clone()
    .resize({
      width: THUMB_WIDTH,
      height: THUMB_HEIGHT,
      fit: "cover",
      position: "attention",
    })
    .webp({
      quality: THUMB_QUALITY,
      effort: 6,
    })
    .toBuffer();

  await storage.write(
    thumbnailDestination,
    thumbnailBuffer,
    "image/webp"
  );
}

export function getEventImagePath(
  eventId: number,
  name: string
) {
  return `/events/${eventId}/${name}.webp`;
}

export function getEventThumbnailPath(
  eventId: number,
  name: string
) {
  return `/events/${eventId}/thumbs/${name}.webp`;
}

export async function deleteImage(
  image: string,
  thumbnail?: string
) {
  const storage = getImageStorage();

  await storage.delete(image);

  if (!thumbnail)
    return;

  await storage.delete(thumbnail);
}