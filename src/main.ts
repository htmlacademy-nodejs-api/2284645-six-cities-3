import 'reflect-metadata';
import { Container } from 'inversify';
import { applicationContainer } from './app/application.container.js';
import Application from './app/application.js';
import { Component } from './types/component.type.js';
import { userContainer } from './modules/user/user.container.js';
import { rentalOfferContainer } from './modules/rentaloffer/rental-offer.container.js';
import { commentContainer } from './modules/comment/comment.containter.js';

const mainContainer = Container.merge(
  applicationContainer,
  userContainer,
  rentalOfferContainer,
  commentContainer
);

async function bootstrap() {
  const application = mainContainer.get<Application>(Component.Application);
  await application.init();
}

bootstrap();
