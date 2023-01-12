import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { RentalOfferEntity, RentalOfferModel } from './rental-offer.entity.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';
import RentalOfferService from './rental-offer.service.js';

const rentalOfferContainer = new Container();

rentalOfferContainer.bind<RentalOfferServiceInterface>(Component.RentalOfferServiceInterface).to(RentalOfferService);
rentalOfferContainer.bind<types.ModelType<RentalOfferEntity>>(Component.RentalOfferModel).toConstantValue(RentalOfferModel);

export { rentalOfferContainer };
