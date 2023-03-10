import dayjs from 'dayjs';
import { HousingType, housingTypes } from '../../types/enums/housing-type.enum.js';
import { OfferFeatures, offerFeatures } from '../../types/enums/offer-features.enum.js';
import { MockData } from '../../types/mock-data.type.js';
import { getRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

const MIN_PRICE = 50;
const MAX_PRICE = 1000;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(): string {
    const
      name = getRandomItem<string>(this.mockData.names),
      description = getRandomItem<string>(this.mockData.descriptions),
      createdDate = dayjs().subtract(getRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString(),
      city = getRandomItem<string>(this.mockData.cities),
      previewImage = getRandomItem<string>(this.mockData.previewImages),
      photos = getRandomItems<string>(this.mockData.photos).join(','),
      isPremium = getRandomValue(0, 1) === 1,
      isFavorite = getRandomValue(0, 1) === 1,
      type = getRandomItem<string>(housingTypes.map((t) => <HousingType>t)),
      rating = getRandomValue(1, 5),
      rooms = getRandomValue(1, 6),
      guests = getRandomValue(1, 10),
      price = getRandomValue(MIN_PRICE, MAX_PRICE).toString(),
      features = getRandomItems<string>(offerFeatures.map((t) => <OfferFeatures>t)).join(','),
      author = getRandomItem(this.mockData.authors),
      longitude = getRandomValue(2.390, 51.205).toFixed(3),
      latitude = getRandomValue(1.005, 36.815).toFixed(3);

    return [
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
      author.name,
      author.email,
      author.avatar,
      author.type,
      longitude,
      latitude,
    ].join('\t');
  }
}
