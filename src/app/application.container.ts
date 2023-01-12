import { Container } from 'inversify';
import { Component } from '../types/component.type.js';
import { ConfigInterface } from '../utils/config/config.interface.js';
import ConfigService from '../utils/config/config.service.js';
import { DatabaseInterface } from '../utils/database/database.interface.js';
import DatabaseService from '../utils/database/database.service.js';
import { LoggerInterface } from '../utils/logger/logger.interface.js';
import LoggerService from '../utils/logger/logger.service.js';
import Application from './application.js';

const applicationContainer = new Container();

applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();

export { applicationContainer };
