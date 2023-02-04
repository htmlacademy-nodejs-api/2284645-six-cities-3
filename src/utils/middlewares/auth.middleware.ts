import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../../types/interfaces/middleware.interface';
import * as jose from 'jose';
import { createSecretKey } from 'crypto';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class AuthMiddleware implements MiddlewareInterface {
  constructor(private readonly secret: string) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers?.authorization?.split(' ');
    if (!authHeader) {
      return next();
    }

    const [, token] = authHeader;

    try {
      const { payload } = await jose.jwtVerify(token, createSecretKey(this.secret, 'utf8'));
      req.user = { email: payload.email as string, id: payload.id as string };

      return next();
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthMiddleware'
      ));
    }
  }
}
