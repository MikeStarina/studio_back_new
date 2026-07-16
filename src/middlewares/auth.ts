import { Request, Response, NextFunction } from "express";
import ServerError from "../utils/server-error-class";
import { ITokenPayload, verifyToken } from "../utils/auth-token";
import { AUTH_COOKIE_NAME } from "../config";
import { TUserRole } from "../models/user";

export type AuthRequest = Request & { user?: ITokenPayload };

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token) {
      return next(ServerError.error401("Требуется авторизация"));
    }
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(ServerError.error401("Недействительный или истёкший токен"));
  }
};

export const requireRole =
  (...roles: TUserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ServerError.error401("Требуется авторизация"));
    }
    if (!roles.includes(req.user.role)) {
      return next(ServerError.error401("Недостаточно прав доступа"));
    }
    return next();
  };
