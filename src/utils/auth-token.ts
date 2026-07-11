import jwt from "jsonwebtoken";
import { Response, CookieOptions } from "express";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  AUTH_COOKIE_NAME,
  COOKIE_DOMAIN,
  IS_PRODUCTION,
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

const buildCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? "none" : "lax",
  domain: COOKIE_DOMAIN,
  path: "/",
});

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...buildCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, buildCookieOptions());
};
