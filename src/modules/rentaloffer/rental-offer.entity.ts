import typegoose, { defaultClasses, Ref } from '@typegoose/typegoose';
import { CityNamesEnum } from '../../types/cities.js';
import { HousingType, housingTypes } from '../../types/enums/housing-type.enum.js';
import { OfferFeatures } from '../../types/enums/offer-features.enum.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface RentalOfferEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'rentaloffers',
  }
})
export class RentalOfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, minlength: 10, maxlength: 100 })
  public name!: string;

  @prop({ trim: true, required: true, minlength: 20, maxlength: 1024 })
  public description!: string;

  @prop({ required: true })
  public createdDate!: Date;

  @prop({ enum: CityNamesEnum, required: true })
  public city!: string;

  @prop({ required: true })
  public previewImage!: string;

  @prop({ type: String, required: true })
  public photos!: string[];

  @prop({ required: true })
  public isPremium!: boolean;

  @prop({ enum: housingTypes, required: true })
  public type!: HousingType;

  @prop({ default: 1, required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, min: 1, max: 8 })
  public rooms!: number;

  @prop({ required: true, min: 1, max: 10 })
  public guests!: number;

  @prop({ required: true, min: 100, max: 100000 })
  public price!: number;

  @prop({ type: String, required: true, minlength: 1 })
  public features!: OfferFeatures[];

  @prop({ default: 0 })
  public commentCount!: number;

  @prop({
    ref: () => UserEntity,
    required: true,
    _id: false
  })
  public authorId!: Ref<UserEntity>;

  @prop({ required: true, default: [0, 0] })
  public coordinates!: [number, number];
}
