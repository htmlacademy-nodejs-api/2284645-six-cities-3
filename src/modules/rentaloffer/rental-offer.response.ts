import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { CityEnum } from '../../types/cities.js';
import { HousingType } from '../../types/enums/housing-type.enum.js';
import { OfferFeatures } from '../../types/enums/offer-features.enum.js';

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

  @Expose()
  @Transform((value) => {
    if ('value' in value) {
      return value.obj[value.key];
    }
    return 'unknown value';
  })
  public authorId!: Types.ObjectId;
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

  @Expose()
  @Transform((value) => {
    if ('value' in value) {
      return value.obj[value.key];
    }
    return 'unknown value';
  })
  public authorId!: Types.ObjectId;

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
  public latitude!: number;

  @Expose()
  public longtitude!: number;
}
