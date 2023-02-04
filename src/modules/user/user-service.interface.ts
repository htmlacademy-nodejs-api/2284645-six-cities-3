import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  verify(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
}
