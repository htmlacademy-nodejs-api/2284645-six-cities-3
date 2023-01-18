import { RentalOffer } from './rental-offer.type';
import { User } from './user.type';

export type Comment = {
    text: string;
    createdDate: Date;
    rating: number;
    author: User;
  offer: RentalOffer;
}
