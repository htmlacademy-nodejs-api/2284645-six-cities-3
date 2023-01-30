import { IsMongoId, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'Min length is 5, max is 1024' })
  public text!: string;

  @IsMongoId({ message: 'authorId field must be a valid id' })
  public authorId!: string;

  @IsMongoId({ message: 'offerId field must be a valid id' })
  public offerId!: string;
}
