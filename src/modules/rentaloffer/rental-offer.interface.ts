import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types.js';
import { LeanDocument, Types } from 'mongoose';
import { CityEnum } from '../../types/cities.js';
import { UserEntity } from '../user/user.entity';
import { CreateRentalOfferDto, UpdateRentalOfferDto } from './dto/rental-offer.dto';
import { RentalOfferEntity } from './rental-offer.entity';

export interface RentalOfferServiceInterface {
  create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>>;
  find(limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null>;
  findRecent(limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null>;
  findHot(limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null>;
  findPremiumByCity(city: CityEnum, limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null>;
  findFavorites(userId: string): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null>;
  findById(offerId: string, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>) | null>;
  updateById(offerId: string, dto: UpdateRentalOfferDto): Promise<DocumentType<RentalOfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null>;
  increaseCommentCount(offerId: string): Promise<DocumentType<RentalOfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  favorite(user: DocumentType<UserEntity, BeAnObject>, offerId: Types.ObjectId): Promise<DocumentType<UserEntity> | null>;
  calculateRating(offerId: Types.ObjectId): Promise<number>;
  updateRating(offerId: Types.ObjectId): Promise<DocumentType<RentalOfferEntity, BeAnObject> | null>;
}
