import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { UserServiceInterface } from './user-service.interface.js';
import { Component } from '../../types/component.type.js';
import { UserEntity, UserModel } from './user.entity.js';
import UserService from './user.service.js';


const userContainer = new Container();

userContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

export { userContainer };
