import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../utils/logger/logger.interface.js';
import { Component } from '../types/component.type.js';
import { ConfigInterface } from '../utils/config/config.interface.js';
import { DatabaseInterface } from '../utils/database/database.interface.js';
import { getURI } from '../utils/db.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private dbClient: DatabaseInterface
  ) { }

  public async init() {
    this.logger.info('Инициализация приложения…');
    this.logger.info(`Значение env для $PORT - ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.dbClient.connect(uri);
  }
}
