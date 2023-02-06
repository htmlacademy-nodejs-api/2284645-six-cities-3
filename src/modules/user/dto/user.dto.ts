import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'String is required' })
  @Length(1, 15, { message: 'Min name length is 1, max is 15' })
  public name!: string;

  @IsEmail({}, { message: 'Valid email is required' })
  public email!: string;

  @IsString({ message: 'String is required' })
  @Length(6, 12, { message: 'Min password length is 6, max is 12' })
  public password!: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'String is required' })
  @Length(6, 12, { message: 'Min password length is 6, max is 12' })
  public name?: string;

  @IsOptional()
  @IsString({ message: 'String is required' })
  public avatar?: string;
}

export class LoginUserDto {
  @IsEmail({}, { message: 'Valid email is required' })
  public email!: string;

  @IsString({ message: 'String is required' })
  @Length(6, 12, { message: 'Min password length is 6, max is 12' })
  public password!: string;
}
