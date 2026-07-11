import { ITokenPayload } from "../utils/auth-token";

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

export {};
