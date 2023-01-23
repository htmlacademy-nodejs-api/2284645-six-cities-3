import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { UserServiceInterface } from './user-service.interface.js';
import { Component } from '../../types/component.type.js';
import { UserEntity } from './user.entity.js';
import UserService from './user.service.js';
import { ControllerInterface } from '../../utils/controller/controller.interface.js';
import UserController from './user.controller.js';
import { UserModel } from '../models.js';


const userContainer = new Container();

userContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
userContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();

export { userContainer };
