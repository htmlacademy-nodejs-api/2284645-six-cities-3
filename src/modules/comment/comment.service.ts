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
    return this.commentModel
      .findById(commentId)
      .populate(['authorId', 'offerId'])
      .exec();
  }

  public async findByOfferId(limit: number, offerId: string): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: 'desc' })
      .limit(limit)
      .populate(['authorId'])
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const res = await this.commentModel.deleteMany({ offerId }).exec();
    return res.deletedCount;
  }
}
