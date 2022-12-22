import { readFileSync } from 'fs';
import { CityEnum } from '../../types/cities.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { OfferFeatures } from '../../types/offer-features.enum.js';
import { RentalOffer } from '../../types/rental-offer.type.js';
import { UserType } from '../../types/user-type.enum.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
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
        coordinates
      ]) => ({
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
      }));
  }
}
