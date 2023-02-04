import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { CityEnum, CityNamesEnum } from '../../../types/cities.js';
import { HousingType, housingTypes } from '../../../types/enums/housing-type.enum.js';
import { offerFeatures, OfferFeatures } from '../../../types/enums/offer-features.enum.js';

export class CreateRentalOfferDto {
  @IsString({ message: 'String is required' })
  @Length(10, 100, { message: 'Min length is 10, max is 100' })
  public name!: string;

  @IsString({ message: 'String is required' })
  @Length(20, 1024, { message: 'Min length is 20, max is 1024' })
  public description!: string;

  @IsDateString({}, { message: 'createdDate must be valid ISO date' })
  public createdDate!: Date;

  @IsEnum(CityNamesEnum, { message: 'Valid city is required' })
  public city!: CityEnum;

  @IsString({ message: 'String is required' })
  public previewImage!: string;

  @IsString({ message: 'String is required', each: true })
  public photos!: string[];

  @IsBoolean({ message: 'Boolean is required' })
  public isPremium!: boolean;

  @IsEnum(housingTypes, { message: 'Valid housing type is required' })
  public type!: HousingType;

  @IsNumber({}, { message: 'Number is required' })
  @Min(1, { message: 'Min length is 1' })
  @Max(8, { message: 'Max length is 8' })
  public rooms!: number;

  @IsNumber({}, { message: 'Number is required' })
  @Min(1, { message: 'Min length is 1' })
  @Max(10, { message: 'Max length is 10' })
  public guests!: number;

  @IsNumber({}, { message: 'Number is required' })
  @Min(100, { message: 'Min length is 100' })
  @Max(100000, { message: 'Max length is 100000' })
  public price!: number;

  @IsEnum(offerFeatures, { message: 'Valid offer feature is required', each: true })
  public features!: OfferFeatures[];

  @IsMongoId({ message: 'authorId field must be a valid id' })
  public authorId!: string;

  @IsArray({ message: 'coordinates field must be an array' })
  @ArrayMinSize(2, { message: 'coordinates field must have 2 elements' })
  @ArrayMaxSize(2, { message: 'coordinates field must have 2 elements' })
  @IsNumber({}, { each: true })
  public coordinates!: [number, number];
}

export class UpdateRentalOfferDto {
  @IsOptional()
  @IsString({ message: 'String is required' })
  @Length(10, 100, { message: 'Min length is 10, max is 100' })
  public name!: string;

  @IsOptional()
  @IsString({ message: 'String is required' })
  @Length(20, 1024, { message: 'Min length is 20, max is 1024' })
  public description!: string;

  @IsOptional()
  @IsDateString({}, { message: 'createdDate must be valid ISO date' })
  public createdDate!: Date;

  @IsOptional()
  @IsEnum(CityNamesEnum, { message: 'Valid city is required' })
  public city!: CityEnum;

  @IsOptional()
  @IsString({ message: 'String is required' })
  public previewImage!: string;

  @IsOptional()
  @IsString({ message: 'String is required', each: true })
  public photos!: string[];

  @IsOptional()
  @IsBoolean({ message: 'Boolean is required' })
  public isPremium!: boolean;

  @IsOptional()
  @IsEnum(housingTypes, { message: 'Valid housing type is required' })
  public type!: HousingType;

  @IsOptional()
  @IsNumber({}, { message: 'Number is required' })
  @Min(1, { message: 'Min length is 1' })
  @Max(8, { message: 'Max length is 8' })
  public rooms!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Number is required' })
  @Min(1, { message: 'Min length is 1' })
  @Max(10, { message: 'Max length is 10' })
  public guests!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Number is required' })
  @Min(100, { message: 'Min length is 100' })
  @Max(100000, { message: 'Max length is 100000' })
  public price!: number;

  @IsOptional()
  @IsEnum(offerFeatures, { message: 'Valid offer feature is required', each: true })
  public features!: OfferFeatures[];

  @IsOptional()
  @IsArray({ message: 'coordinates field must be an array' })
  @ArrayMinSize(2, { message: 'coordinates field must have 2 elements' })
  @ArrayMaxSize(2, { message: 'coordinates field must have 2 elements' })
  @IsNumber({}, { each: true })
  public coordinates!: [number, number];
}
