import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from './enums/http-method.enum';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
