import type { ImageStorage } from "./imageStorage";
import { LocalImageStorage } from "./localImageStorage";
import { SupabaseImageStorage } from "./supabaseImageStorage";

export function getImageStorage(): ImageStorage {
  const provider = process.env.IMAGE_STORAGE_PROVIDER;

  if (provider === "supabase") {
    return new SupabaseImageStorage();
  }

  return new LocalImageStorage();
}