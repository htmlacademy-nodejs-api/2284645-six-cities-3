import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface.js';
import { DatabaseInterface } from './database.interface.js';
import { Component } from '../../types/component.type.js';

@injectable()
export default class DatabaseService implements DatabaseInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) { }

  public async connect(uri: string): Promise<void> {
    this.logger.info('Подключение к MongoDB...');
    await mongoose.connect(uri);
    this.logger.info('Подключение к БД установлено.');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Покдлючение к БД закрыто.');
  }
}
