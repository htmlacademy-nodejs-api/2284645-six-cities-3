import { CityEnum } from '../types/cities.js';
import { HousingType } from '../types/enums/housing-type.enum.js';
import { OfferFeatures } from '../types/enums/offer-features.enum.js';
import { UserType } from '../types/enums/user-type.enum.js';
import { RentalOffer } from '../types/rental-offer.type';
import crypto from 'crypto';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    name,
    description,
    createdDate,
    city,
    previewImage,
    photos,
    isPremium,
    isFavorite,
    type,
    rating,
    rooms,
    guests,
    price,
    features,
    authorName,
    authorEmail,
    authorAvatar,
    authorType,
    latitude,
    longitude,
  ] = tokens;
  return {
    name,
    description,
    createdDate: new Date(createdDate),
    city: city as unknown as CityEnum,
    previewImage,
    photos: photos.split(','),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    type: type as HousingType,
    rating: Number.parseInt(rating, 10),
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    features: features.split(',') as OfferFeatures[],
    author: {
      name: authorName,
      email: authorEmail,
      avatar: authorAvatar,
      type: authorType as UserType,
    },
    latitude: Number.parseFloat(latitude),
    longitude: Number.parseFloat(longitude),
  } as RentalOffer;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
