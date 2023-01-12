import { UserType } from '../../../types/enums/user-type.enum';

export default class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatar!: string;
  public type!: UserType;
  public password!: string;
}
