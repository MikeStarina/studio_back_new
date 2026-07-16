import dotenv from "dotenv";

const ENV = dotenv.config();
const parsed = ENV.parsed ?? {};

const getEnv = (key: string, fallback?: string): string => {
  const value = parsed[key] ?? process.env[key];
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const IS_PRODUCTION = NODE_ENV === "production";

export const JWT_SECRET = getEnv(
  "JWT_SECRET",
  IS_PRODUCTION ? undefined : "dev-insecure-secret-change-me"
);
export const JWT_EXPIRES_IN = getEnv("JWT_EXPIRES_IN", "7d");

export const FRONTEND_URL = getEnv("FRONTEND_URL", "http://localhost:3000");

/** Empty string in .env must not become Domain="" (browsers reject it). */
const rawCookieDomain = parsed.COOKIE_DOMAIN ?? process.env.COOKIE_DOMAIN;
export const COOKIE_DOMAIN =
  rawCookieDomain && rawCookieDomain.trim() !== ""
    ? rawCookieDomain.trim()
    : undefined;

/**
 * Cross-site cookies (SameSite=None; Secure) are required when the frontend
 * and API are on different sites (e.g. studio.pnhd.ru → pnhdstudioapi.ru,
 * or localhost → pnhdstudioapi.ru).
 *
 * Override with COOKIE_CROSS_SITE=true|false. Otherwise: on in production, or
 * when FRONTEND_URL is not localhost.
 */
const explicitCrossSite = (
  parsed.COOKIE_CROSS_SITE ?? process.env.COOKIE_CROSS_SITE ?? ""
).toLowerCase();

const frontendIsLocal = (() => {
  try {
    const host = new URL(FRONTEND_URL).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return true;
  }
})();

export const USE_CROSS_SITE_COOKIES =
  explicitCrossSite === "true"
    ? true
    : explicitCrossSite === "false"
      ? false
      : IS_PRODUCTION || !frontendIsLocal;

export const AUTH_COOKIE_NAME = "token";

export const OTP_TTL_MINUTES = parseInt(getEnv("OTP_TTL_MINUTES", "10"), 10);
export const OTP_MAX_ATTEMPTS = parseInt(getEnv("OTP_MAX_ATTEMPTS", "5"), 10);
export const OTP_RESEND_COOLDOWN_SECONDS = parseInt(
  getEnv("OTP_RESEND_COOLDOWN_SECONDS", "60"),
  10
);
