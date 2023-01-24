export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatar!: string;
  public password!: string;
}

export class UpdateUserDto {
  public name!: string;
  public avatar!: string;
}

export class LoginUserDto {
  public email!: string;
  public password!: string;
}
