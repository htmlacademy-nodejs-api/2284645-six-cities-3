import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/comment.dto';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  findByOfferId(limit: number, offerId: string): Promise<DocumentType<CommentEntity>[] | null>;
  deleteByOfferId(offerId: string): Promise<number>;
}
