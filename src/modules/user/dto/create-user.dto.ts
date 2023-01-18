import { UserType } from '../../../types/enums/user-type.enum';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatar!: string;
  public type!: UserType;
  public password!: string;
}

export class UpdateUserDto {
  public name!: string;
  public avatar!: string;
  public password!: string;
}
