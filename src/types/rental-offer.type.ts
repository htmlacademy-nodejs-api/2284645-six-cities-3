
import { CityEnum } from './cities.js';
import { HousingType } from './enums/housing-type.enum.js';
import { OfferFeatures } from './enums/offer-features.enum';
import { User } from './user.type';

export type RentalOffer = {
	name: string;
	description: string;
	createdDate: Date;
	city: CityEnum;
	previewImage: string;
	photos: string[];
	isPremium: boolean;
	isFavorite: boolean;
	type: HousingType;
	rating: number;
	rooms: number;
	guests: number;
	price: number;
	features: OfferFeatures[];
	author: User;
	coordinates: {
		latitude: number;
		longitude: number;
	};
}
