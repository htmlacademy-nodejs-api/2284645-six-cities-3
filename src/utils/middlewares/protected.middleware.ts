import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/interfaces/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export class ProtectedMiddleware implements MiddlewareInterface {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'You must be authorized to access this resource!',
        'ProtectedMiddleware'
      ));
    }

    return next();
  }
}
