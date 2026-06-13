import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/** Application-level error with an explicit HTTP status code. */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Central error handler: maps known error types to clean JSON responses. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Sequelize unique constraint violations -> 409 Conflict
  if (err && typeof err === 'object' && (err as { name?: string }).name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
}
