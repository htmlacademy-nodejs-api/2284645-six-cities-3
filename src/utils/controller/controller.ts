import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { LoggerInterface } from '../logger/logger.interface.js';
import { RouteInterface } from '../../types/interfaces/route.interface.js';
import { ControllerInterface } from './controller.interface.js';
import { ConfigInterface } from '../config/config.interface.js';
import { UnknownObject } from '../../types/unknown-object.type.js';
import { getFullServerPath, transformObject } from '../common.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/application.constant.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface,
  ) {
    this._router = Router();
  }

  protected addStaticPath(data: UnknownObject): void {
    const fullPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
    transformObject(STATIC_RESOURCE_FIELDS,
      `${fullPath}/${this.configService.get('STATIC_FOLDER')}`,
      `${fullPath}/${this.configService.get('UPLOAD_FOLDER')}`,
      data
    );
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`[${this.constructor.name}]: + ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(<UnknownObject>data);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
