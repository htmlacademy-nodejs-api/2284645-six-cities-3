import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { CreateRentalOfferDto, UpdateRentalOfferDto } from './dto/rental-offer.dto.js';
import { RentalOfferEntity } from './rental-offer.entity.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';
import { CommentServiceInterface } from '../comment/comment.interface.js';

@injectable()
export default class RentalOfferService implements RentalOfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.RentalOfferModel) private readonly offerModel: types.ModelType<RentalOfferEntity>,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) { }

  public async create(dto: CreateRentalOfferDto): Promise<DocumentType<RentalOfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New rental offer created: ${dto.name}`);

    return result;
  }

  public async find(): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find().populate(['authorId']).exec();
  }

  public async findRecent(limit: number): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find().sort({ createdDate: 'desc' }).limit(limit).populate(['authorId']).exec();
  }

  public async findHot(limit: number): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find().sort({ commentCount: 'asc' }).limit(limit).populate(['authorId']).exec();
  }

  public async findPremium(limit = 3): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
    return this.offerModel.find({ isPremium: true }).sort({ createdDate: 'desc' }).limit(limit).populate(['authorId']).exec();
  }

  // Will be implemented when we have a user service
  // public async findFavorite(): Promise<DocumentType<RentalOfferEntity, types.BeAnObject>[] | null> {
  // }

  public async findById(offerId: string): Promise<DocumentType<RentalOfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['authorId']).exec();
  }

  public async updateById(offerId: string, dto: UpdateRentalOfferDto): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate(['authorId']).exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    const res = await this.commentService.deleteByOfferId(offerId);
    this.logger.info(`Deleted offer with id ${offerId} and it's ${res} comments`);
    return this.offerModel.findByIdAndDelete(offerId).populate(['authorId']).exec();
  }

  public async increaseCommentCount(offerId: string): Promise<DocumentType<RentalOfferEntity, types.BeAnObject> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { '$inc': { 'commentCount': 1 } }, { new: true }).exec();
  }
}
