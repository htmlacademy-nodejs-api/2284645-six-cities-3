import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { RentalOfferEntity } from './rental-offer.entity.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';
import RentalOfferService from './rental-offer.service.js';
import RentalOfferController from './rental-offer.controller.js';
import { ControllerInterface } from '../../utils/controller/controller.interface.js';
import { RentalOfferModel } from '../models.js';

const rentalOfferContainer = new Container();

rentalOfferContainer.bind<RentalOfferServiceInterface>(Component.RentalOfferServiceInterface).to(RentalOfferService);
rentalOfferContainer.bind<types.ModelType<RentalOfferEntity>>(Component.RentalOfferModel).toConstantValue(RentalOfferModel);
rentalOfferContainer.bind<ControllerInterface>(Component.RentalOfferController).to(RentalOfferController).inSingletonScope();

export { rentalOfferContainer };
