import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/comment.dto.js';
import { CommentServiceInterface } from './comment.interface.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    return result.populate(['authorId', 'offerId']);
  }

  public async findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(commentId).populate(['authorId', 'offerId']).exec();
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel.find({ offerId }).populate(['authorId', 'offerId']).exec();
  }

  public async findRecentByOfferId(offerId: string, limit = 50): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel.find({ offerId }).sort({ createdDate: 'desc' }).limit(limit).populate(['authorId', 'offerId']).exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const res = await this.commentModel.deleteMany({ offerId }).exec();
    return res.deletedCount;
  }
}
