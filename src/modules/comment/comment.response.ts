import { Expose, Type } from 'class-transformer';
import { UserResponse } from '../user/user.response.js';

export class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'createdAt' })
  public createdDate!: string;

  @Expose({ name: 'authorId' })
  @Type(() => UserResponse)
  public user!: UserResponse;
}
