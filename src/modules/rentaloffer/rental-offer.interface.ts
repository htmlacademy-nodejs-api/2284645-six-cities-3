import { DocumentType } from '@typegoose/typegoose';
import CreateRentalOfferDto from './dto/rental-offer.dto';
import { RentalOfferEntity } from './rental-offer.entity';

export interface RentalOfferServiceInterface {
  create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>>;
  findById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null>;
}
