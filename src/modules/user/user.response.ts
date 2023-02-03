import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class UserResponse {
  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar!: string;

  @Expose()
  @Transform((value) => {
    if ('value' in value) {
      return value.obj[value.key];
    }
    return 'unknown value';
  })
  public favoriteOffers!: Types.ObjectId[];
}

export class TokenUserResponse {
  @Expose()
  public email!: string;

  @Expose()
  public token!: string;
}
