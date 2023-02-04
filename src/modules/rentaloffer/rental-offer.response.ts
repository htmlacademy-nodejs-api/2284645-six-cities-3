import { Expose, Type } from 'class-transformer';
import { CityEnum } from '../../types/cities.js';
import { HousingType } from '../../types/enums/housing-type.enum.js';
import { OfferFeatures } from '../../types/enums/offer-features.enum.js';
import { UserResponse } from '../user/user.response.js';

export class RentalOfferListResponse {
  @Expose()
  public price!: number;

  @Expose()
  public name!: string;

  @Expose()
  public type!: HousingType;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public createdDate!: Date;

  @Expose()
  public city!: CityEnum;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentCount!: number;

  @Expose({ name: 'authorId' })
  @Type(() => UserResponse)
  public user!: UserResponse;
}

export class RentalOfferFullResponse {
  @Expose()
  public price!: number;

  @Expose()
  public name!: string;

  @Expose()
  public type!: HousingType;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public createdDate!: Date;

  @Expose()
  public city!: CityEnum;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentCount!: number;

  @Expose({ name: 'authorId' })
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public description!: string;

  @Expose()
  public photos!: string[];

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public features!: OfferFeatures[];

  @Expose()
  public coordinates!: [number, number];
}
