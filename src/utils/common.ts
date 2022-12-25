import { CityEnum } from '../types/cities.js';
import { HousingType } from '../types/enums/housing-type.enum.js';
import { OfferFeatures } from '../types/enums/offer-features.enum.js';
import { UserType } from '../types/enums/user-type.enum.js';
import { RentalOffer } from '../types/rental-offer.type';

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
    authorPassword,
    authorType,
    coordinates,
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
    type: HousingType[type as 'apartment' | 'house' | 'room' | 'hotel'],
    rating: Number.parseInt(rating, 10),
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    features: features.split(',') as unknown as OfferFeatures[],
    author: {
      name: authorName,
      email: authorEmail,
      avatar: authorAvatar,
      password: authorPassword,
      type: authorType as unknown as UserType,
    },
    coordinates: (() => {
      const [latitude, longitude] = coordinates.split(',');
      return {
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      };
    })(),
  } as RentalOffer;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';
