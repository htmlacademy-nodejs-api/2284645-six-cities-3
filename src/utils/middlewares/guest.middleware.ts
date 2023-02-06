import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../../types/interfaces/middleware.interface.js';
import HttpError from '../errors/http-error.js';

export class GuestMiddleware implements MiddlewareInterface {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (req.user) {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Authorized users do not have access to this resource!',
        'GuestMiddleware'
      ));
    }

    return next();
  }
}
