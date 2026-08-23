import { PUBLIC_API_URL } from "../config";

const LEGACY_MEDIA_HOSTS = new Set([
  "pnhdstudioapi.ru",
  "www.pnhdstudioapi.ru",
]);

/** Rewrite old API hosts / relative paths to the current public API origin. */
export const rewriteLegacyMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (LEGACY_MEDIA_HOSTS.has(parsed.hostname)) {
        return `${PUBLIC_API_URL}${parsed.pathname}${parsed.search}`;
      }
      return trimmed;
    } catch {
      return trimmed;
    }
  }

  return `${PUBLIC_API_URL}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
};
