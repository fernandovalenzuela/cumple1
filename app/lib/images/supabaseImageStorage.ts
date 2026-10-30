import { getSupabaseServer } from "@/lib/supabase/server";

import type { ImageStorage } from "./imageStorage";

const BUCKET = "events";

function normalizePath(path: string) {
  return path.replace(/^[/\\]+/, "");
}

export class SupabaseImageStorage implements ImageStorage {
  async write(
    path: string,
    data: Buffer,
    contentType: string
  ): Promise<void> {
    const objectPath = normalizePath(path);

    const { error } = await getSupabaseServer().storage
		.from(BUCKET)
      .upload(objectPath, data, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(
        `Error al guardar imagen en Supabase Storage: ${error.message}`
      );
    }
  }

  async delete(path: string): Promise<void> {
    const objectPath = normalizePath(path);

    const { error } = await getSupabaseServer().storage
		.from(BUCKET)
      .remove([objectPath]);

    if (error) {
      throw new Error(
        `Error al eliminar imagen de Supabase Storage: ${error.message}`
      );
    }
  }

  getUrl(path: string): string {
    const objectPath = normalizePath(path);

    const {
      data: { publicUrl },
    } = getSupabaseServer().storage
		  .from(BUCKET)
		  .getPublicUrl(objectPath);

    return publicUrl;
  }
}