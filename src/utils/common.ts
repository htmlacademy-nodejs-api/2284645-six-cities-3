import { CityEnum } from '../types/cities.js';
import { HousingType } from '../types/enums/housing-type.enum.js';
import { OfferFeatures } from '../types/enums/offer-features.enum.js';
import { UserType } from '../types/enums/user-type.enum.js';
import { RentalOffer } from '../types/rental-offer.type';
import crypto from 'crypto';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as jose from 'jose';
import { ValidationErrorField } from '../types/validation-error.type.js';
import { ValidationError } from 'class-validator';
import { ServiceError } from '../types/service-error.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';
import { UnknownObject } from '../types/unknown-object.type.js';

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
  return <RentalOffer>{
    name,
    description,
    createdDate: new Date(createdDate),
    city: <CityEnum>city,
    previewImage,
    photos: photos.split(','),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    type: <HousingType>type,
    rating: Number.parseInt(rating, 10),
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    features: <OfferFeatures[]>features.split(','),
    commentCount: 0,
    author: {
      name: authorName,
      email: authorEmail,
      avatar: authorAvatar,
      type: <UserType>authorType,
    },
    coordinates: [Number.parseFloat(latitude), Number.parseFloat(longitude)],
  };
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, secret: string, payload: object) => new jose.SignJWT({ ...payload })
  .setProtectedHeader({ alg: algoritm })
  .setIssuedAt()
  .setExpirationTime('2d')
  .sign(crypto.createSecretKey(secret, 'utf8'));

export const average = (arr: number[]) => arr
  .reduce((a, b) => a + b, 0) / arr.length;

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (property: string, someObject: UnknownObject, transformFn: (object: UnknownObject) => void) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, <UnknownObject>someObject[key], transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data: UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(<string>target[property]) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};
