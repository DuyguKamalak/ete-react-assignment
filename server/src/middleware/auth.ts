import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { HttpError } from './errorHandler';

export interface AuthedRequest extends Request {
  userId?: number;
  username?: string;
}

/** Validates the `Authorization: Bearer <token>` header and attaches the user. */
export function authenticate(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Authentication required'));
  }

  const token = header.slice('Bearer '.length);
  const payload = authService.verifyToken(token);
  req.userId = payload.sub;
  req.username = payload.username;
  next();
}
