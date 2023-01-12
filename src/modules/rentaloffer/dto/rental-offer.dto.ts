import { CityEnum } from '../../../types/cities.js';
import { HousingType } from '../../../types/enums/housing-type.enum.js';
import { OfferFeatures } from '../../../types/enums/offer-features.enum.js';

export default class CreateRentalOfferDto {
  public name!: string;
  public description!: string;
  public createdDate!: Date;
  public city!: CityEnum;
  public previewImage!: string;
  public photos!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public type!: HousingType;
  public rating!: number;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public features!: OfferFeatures[];
  public authorId!: string;
  public latitude!: number;
}
