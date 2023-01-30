
import typegoose, { defaultClasses, Ref } from '@typegoose/typegoose';
import { RentalOfferEntity } from '../rentaloffer/rental-offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

const { prop, modelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ minlength: 5, maxlength: 1024, required: true })
  public text!: string;

  @prop({ default: 1, required: true, min: 1, max: 5 })
  public rating!: number;

  @prop({
    ref: UserEntity,
    required: true,
    _id: false
  })
  public authorId!: Ref<UserEntity>;

  @prop({
    ref: RentalOfferEntity,
    required: true,
    _id: false
  })
  public offerId!: Ref<RentalOfferEntity>;
}
