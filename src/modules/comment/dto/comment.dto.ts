import { IsMongoId, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'Min length is 5, max is 1024' })
  public text!: string;

  @IsNumber({}, { message: 'rating is required' })
  @Min(1, { message: 'Min rating is 1' })
  @Max(5, { message: 'Max rating is 5' })
  public rating!: number;

  public authorId!: string;

  @IsMongoId({ message: 'offerId field must be a valid id' })
  public offerId!: string;
}
