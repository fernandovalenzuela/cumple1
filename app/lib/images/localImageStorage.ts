import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import type { ImageStorage } from "./imageStorage";

function getLocalPath(path: string) {
  const normalizedPath = path.replace(/^[/\\]+/, "");

  return join(process.cwd(), "public", normalizedPath);
}

export class LocalImageStorage implements ImageStorage {
  async write(
    path: string,
    data: Buffer,
    _contentType: string
  ): Promise<void> {
    const filePath = getLocalPath(path);

    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, data);
  }

  async delete(path: string): Promise<void> {
    const filePath = getLocalPath(path);

    try {
      await unlink(filePath);
    } catch {
      // El archivo puede no existir.
    }
  }

  getUrl(path: string): string {
    return path.startsWith("/") ? path : `/${path}`;
  }
}