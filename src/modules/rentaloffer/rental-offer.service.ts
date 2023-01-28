import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { CreateRentalOfferDto, UpdateRentalOfferDto } from './dto/rental-offer.dto.js';
import { RentalOfferEntity } from './rental-offer.entity.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';
import { CommentServiceInterface } from '../comment/comment.interface.js';
import { UserEntity } from '../user/user.entity.js';

@injectable()
export default class RentalOfferService implements RentalOfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.RentalOfferModel) private readonly offerModel: types.ModelType<RentalOfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) { }

  public async create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New rental offer created: ${dto.name}`);

    return result;
  }

  public async find(): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find().exec();
  }

  public async findRecent(limit: number): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find().sort({ createdDate: 'desc' }).limit(limit).populate(['author']).exec();
  }

  public async findHot(limit: number): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find().sort({ commentCount: 'asc' }).limit(limit).populate(['author']).exec();
  }

  public async findPremium(limit: number): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find({ isPremium: true }).sort({ createdDate: 'desc' }).limit(limit).populate(['authorId']).exec();
  }

  public async findFavorites(userId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    const favsArray = await this.userModel.findById(userId).select('favoriteOffers').exec();
    if (!favsArray) {
      return null;
    }
    return this.offerModel.find({ _id: { $in: favsArray.favoriteOffers } }).populate(['authorId']).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['authorId']).exec();
  }

  public async updateById(offerId: string, dto: UpdateRentalOfferDto): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate(['authorId']).exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    const res = await this.commentService.deleteByOfferId(offerId);
    this.logger.info(`Deleted offer with id ${offerId} and it's ${res} comments`);
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async increaseCommentCount(offerId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { '$inc': { 'commentCount': 1 } }, { new: true }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: documentId })) !== null;
  }
}
