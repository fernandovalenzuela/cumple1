export interface ImageStorage {
  write(
    path: string,
    data: Buffer,
    contentType: string
  ): Promise<void>;

  delete(path: string): Promise<void>;

  getUrl(path: string): string;
}