import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../utils/logger/logger.interface.js';
import { Component } from '../types/component.type.js';
import { ConfigInterface } from '../utils/config/config.interface.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface
  ) { }

  public async init() {
    this.logger.info('Инициализация приложения…');
    this.logger.info(`Значение env для $PORT - ${this.config.get('PORT')}`);
  }
}
