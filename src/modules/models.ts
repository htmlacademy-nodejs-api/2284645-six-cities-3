import { getModelForClass } from '@typegoose/typegoose';
import { CommentEntity } from './comment/comment.entity.js';
import { RentalOfferEntity } from './rentaloffer/rental-offer.entity.js';
import { UserEntity } from './user/user.entity.js';

export const UserModel = getModelForClass(UserEntity);
export const CommentModel = getModelForClass(CommentEntity);
export const RentalOfferModel = getModelForClass(RentalOfferEntity);
