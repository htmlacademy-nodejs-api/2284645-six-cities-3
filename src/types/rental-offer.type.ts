
import { CityEnum } from './cities.js';
import { HousingType } from './enums/housing-type.enum.js';
import { OfferFeatures } from './enums/offer-features.enum.js';
import { User } from './user.type.js';

export type RentalOffer = {
  name: string;
  description: string;
  createdDate: Date;
  city: CityEnum;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  type: HousingType;
  rating: number;
  rooms: number;
  guests: number;
  price: number;
  features: OfferFeatures[];
  commentCount: number;
  author: User;
  coordinates: [number, number];
}
