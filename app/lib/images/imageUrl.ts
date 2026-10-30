import { getImageStorage } from "./imageStorageProvider";

export function getImageUrl(
  path: string | null | undefined,
  version?: string | null
): string {
  if (!path)
    return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  if (path.startsWith("/events/")) {
    const url = getImageStorage().getUrl(path);

    if (version) {
      return `${url}?v=${encodeURIComponent(version)}`;
    }

    return url;
  }

  return path;
}