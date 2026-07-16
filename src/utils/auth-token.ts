import jwt from "jsonwebtoken";
import { Request, Response, CookieOptions } from "express";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  AUTH_COOKIE_NAME,
  COOKIE_DOMAIN,
  USE_CROSS_SITE_COOKIES,
} from "../config";
import { TUserRole } from "../models/user";

export interface ITokenPayload {
  id: string;
  role: TUserRole;
}

export const signToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): ITokenPayload => {
  return jwt.verify(token, JWT_SECRET) as ITokenPayload;
};

const requestIsHttps = (req?: Request): boolean => {
  if (!req) return false;
  if (req.secure) return true;
  const proto = req.get("x-forwarded-proto");
  return proto?.split(",")[0]?.trim() === "https";
};

const buildCookieOptions = (req?: Request): CookieOptions => {
  // HTTPS API (prod) always needs None+Secure for credentialed cross-origin
  // calls from localhost or studio.pnhd.ru — even if NODE_ENV/FRONTEND_URL
  // were left as development defaults.
  const crossSite = USE_CROSS_SITE_COOKIES || requestIsHttps(req);

  const options: CookieOptions = {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? "none" : "lax",
    path: "/",
  };
  if (COOKIE_DOMAIN) {
    options.domain = COOKIE_DOMAIN;
  }
  return options;
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...buildCookieOptions(res.req),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, buildCookieOptions(res.req));
};
