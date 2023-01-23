import { DocumentType } from '@typegoose/typegoose';
import { CreateRentalOfferDto, UpdateRentalOfferDto } from './dto/rental-offer.dto';
import { RentalOfferEntity } from './rental-offer.entity';

export interface RentalOfferServiceInterface {
  create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>>;
  find(): Promise<DocumentType<RentalOfferEntity>[] | null>;
  findRecent(limit: number): Promise<DocumentType<RentalOfferEntity>[] | null>;
  findHot(limit: number): Promise<DocumentType<RentalOfferEntity>[] | null>;
  findPremium(limit: number): Promise<DocumentType<RentalOfferEntity>[] | null>;
  findFavorites(userId: string): Promise<DocumentType<RentalOfferEntity>[] | null>;
  findById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null>;
  updateById(offerId: string, dto: UpdateRentalOfferDto): Promise<DocumentType<RentalOfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null>;
  increaseCommentCount(offerId: string): Promise<DocumentType<RentalOfferEntity> | null>;
}
