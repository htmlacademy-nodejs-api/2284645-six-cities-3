import { User } from '../../types/user.type.js';
import typegoose, { defaultClasses, Ref } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';
import { UserType, userTypes } from '../../types/enums/user-type.enum.js';
import { RentalOfferEntity } from '../rentaloffer/rental-offer.entity.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'users',
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.type = data.type;
  }

  @prop({ minlength: 1, maxlength: 15, required: true })
  public name!: string;

  @prop({ unique: true, required: true, default: '' })
  public email!: string;

  @prop({ required: true, default: '' })
  public avatar!: string;

  @prop({ enum: userTypes, required: true })
  public type!: UserType;

  @prop({ required: true, default: '' })
  private password!: string;

  @prop({
    ref: () => RentalOfferEntity,
    _id: false
  })
  public favoriteOffers!: Ref<RentalOfferEntity>[];

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}
