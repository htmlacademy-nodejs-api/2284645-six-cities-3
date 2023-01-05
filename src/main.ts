import 'reflect-metadata';
import { Container } from 'inversify';
import Application from './app/application.js';
import { Component } from './types/component.type.js';
import { ConfigInterface } from './utils/config/config.interface.js';
import ConfigService from './utils/config/config.service.js';
import { LoggerInterface } from './utils/logger/logger.interface.js';
import LoggerService from './utils/logger/logger.service.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
