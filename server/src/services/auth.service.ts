import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { env } from '../config/env';
import { HttpError } from '../middleware/errorHandler';

export interface AuthResult {
  token: string;
  user: { id: number; username: string };
}

function signToken(user: User): string {
  return jwt.sign({ sub: user.id, username: user.username }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);
}

export const authService = {
  async register(username: string, password: string): Promise<AuthResult> {
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      throw new HttpError(409, 'Username is already taken');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    return { token: signToken(user), user: { id: user.id, username: user.username } };
  },

  async login(username: string, password: string): Promise<AuthResult> {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new HttpError(401, 'Invalid username or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new HttpError(401, 'Invalid username or password');
    }

    return { token: signToken(user), user: { id: user.id, username: user.username } };
  },

  verifyToken(token: string): { sub: number; username: string } {
    try {
      return jwt.verify(token, env.jwt.secret) as unknown as { sub: number; username: string };
    } catch {
      throw new HttpError(401, 'Invalid or expired token');
    }
  },
};
