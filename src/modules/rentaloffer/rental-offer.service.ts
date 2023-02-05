import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { CreateRentalOfferDto, UpdateRentalOfferDto } from './dto/rental-offer.dto.js';
import { RentalOfferEntity } from './rental-offer.entity.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';
import { CommentServiceInterface } from '../comment/comment.interface.js';
import { UserEntity } from '../user/user.entity.js';
import { BeAnObject } from '@typegoose/typegoose/lib/types.js';
import { LeanDocument, Types } from 'mongoose';
import { CommentEntity } from '../comment/comment.entity.js';
import { average } from '../../utils/common.js';
import { CityEnum } from '../../types/cities.js';
import { RentalOfferDefaults } from './rental-offer.constant.js';

@injectable()
export default class RentalOfferService implements RentalOfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.RentalOfferModel) private readonly offerModel: types.ModelType<RentalOfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) { }

  public async create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New rental offer created: ${dto.name}`);

    return result;
  }

  public async find(limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null> {
    const offers = (user) ? user.favoriteOffers : [];
    return this.offerModel
      .aggregate()
      .sort({ createdDate: 'desc' })
      .lookup({
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId'
      })
      .unwind({
        path: '$authorId',
        preserveNullAndEmptyArrays: true
      })
      .addFields({
        isFavorite: {
          $in: ['$_id', offers]
        }
      })
      .limit(limit)
      .exec();
  }

  public async findRecent(limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null> {
    const offers = (user) ? user.favoriteOffers : [];
    return this.offerModel
      .aggregate()
      .sort({ createdDate: 'desc' })
      .lookup({
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId'
      })
      .unwind({
        path: '$authorId',
        preserveNullAndEmptyArrays: true
      })
      .addFields({
        isFavorite: {
          $in: ['$_id', offers]
        }
      })
      .limit(limit)
      .exec();
  }

  public async findHot(limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null> {
    const offers = (user) ? user.favoriteOffers : [];
    return this.offerModel
      .aggregate()
      .sort({ commentCount: 'asc' })
      .lookup({
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId'
      })
      .unwind({
        path: '$authorId',
        preserveNullAndEmptyArrays: true
      })
      .addFields({
        isFavorite: {
          $in: ['$_id', offers]
        }
      })
      .limit(limit)
      .exec();
  }

  public async findPremiumByCity(city: CityEnum, limit: number, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>)[] | null> {
    const offers = (user) ? user.favoriteOffers : [];
    return this.offerModel
      .aggregate()
      .sort({ createdDate: 'desc' })
      .match({ city, isPremium: true })
      .lookup({
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId'
      })
      .unwind({
        path: '$authorId',
        preserveNullAndEmptyArrays: true
      })
      .addFields({
        isFavorite: {
          $in: ['$_id', offers]
        }
      })
      .limit(limit)
      .exec();
  }

  public async findFavorites(userId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    const userFavorites = await this.userModel.findById(userId).select('favoriteOffers').exec();
    if (!userFavorites) {
      return null;
    }
    return this.offerModel
      .aggregate()
      .match({ _id: { $in: userFavorites.favoriteOffers } })
      .lookup({
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId'
      })
      .unwind({
        path: '$authorId',
        preserveNullAndEmptyArrays: true
      })
      .addFields({
        isFavorite: {
          $in: ['$_id', userFavorites.favoriteOffers]
        }
      })
      .exec();
  }

  public async findById(offerId: string, user?: UserEntity | null): Promise<(LeanDocument<RentalOfferEntity> & Required<{ _id: Types.ObjectId; }>) | null> {
    const offers = (user) ? user.favoriteOffers : [];
    return this.offerModel
      .aggregate()
      .match({ _id: Types.ObjectId.createFromHexString(offerId) })
      .lookup({
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId'
      })
      .unwind({
        path: '$authorId',
        preserveNullAndEmptyArrays: true
      })
      .addFields({
        isFavorite: {
          $in: ['$_id', offers]
        }
      })
      .exec()
      .then((res) => res[0]);
  }

  public async updateById(offerId: string, dto: UpdateRentalOfferDto): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['authorId'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    const res = await this.commentService.deleteByOfferId(offerId);
    this.logger.info(`Deleted offer with id ${offerId} and it's ${res} comments`);
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async increaseCommentCount(offerId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { '$inc': { 'commentCount': 1 } }, { new: true })
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: documentId })) !== null;
  }

  public async favorite(user: DocumentType<UserEntity, BeAnObject>, offerId: Types.ObjectId) {
    const offerIndex = user.favoriteOffers.indexOf(offerId);
    if (offerIndex !== -1) {
      user.favoriteOffers.splice(offerIndex, 1);
    } else {
      user.favoriteOffers.push(offerId);
    }
    await user.save();
    return user;
  }

  public async calculateRating(offerId: Types.ObjectId): Promise<number> {
    const comments = await this.commentModel
      .aggregate()
      .match({ offerId })
      .project({ rating: 1 })
      .exec();
    if (!comments.length) {
      return 1;
    }
    const ratings = [];
    for (const comment of comments) {
      ratings.push(comment.rating);
    }
    return Math.round(average(ratings) * RentalOfferDefaults.RATING_DECIMAL_OFFSET) / RentalOfferDefaults.RATING_DECIMAL_OFFSET;
  }

  public async updateRating(offerId: Types.ObjectId): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    const rating = await this.calculateRating(offerId);
    return this.offerModel
      .findByIdAndUpdate(offerId.toHexString(), { rating }, { new: true })
      .exec();
  }
}
