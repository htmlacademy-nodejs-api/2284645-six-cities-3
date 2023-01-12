import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import CreateRentalOfferDto from './dto/rental-offer.dto.js';
import { RentalOfferEntity } from './rental-offer.entity.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';

@injectable()
export default class RentalOfferService implements RentalOfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.RentalOfferModel) private readonly offerModel: types.ModelType<RentalOfferEntity>
  ) { }

  public async create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New rental offer created: ${dto.name}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }
}
