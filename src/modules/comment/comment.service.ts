import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/comment.dto.js';
import { CommentServiceInterface } from './comment.interface.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly offerModel: types.ModelType<CommentEntity>
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New rental offer created: ${dto.text}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }
}
