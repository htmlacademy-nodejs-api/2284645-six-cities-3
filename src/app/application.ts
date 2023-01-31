import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../utils/logger/logger.interface.js';
import { Component } from '../types/component.type.js';
import { ConfigInterface } from '../utils/config/config.interface.js';
import { DatabaseInterface } from '../utils/database/database.interface.js';
import { getURI } from '../utils/db.js';
import express, { Express } from 'express';
import { ControllerInterface } from '../utils/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../utils/errors/exception-filter.interface.js';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private dbClient: DatabaseInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.RentalOfferController) private offerController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
  ) {
    this.expressApp = express();
  }

  public initRoutes() {
    this.expressApp.use('/offers', this.offerController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use('/static', express.static(this.config.get('STATIC_FOLDER')));
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }


  public async init() {
    this.logger.info('Инициализация приложения...');
    this.logger.info(`Значение env для $PORT - ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.dbClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Сервер работает по адресу http://localhost:${this.config.get('PORT')}`);
  }
}
