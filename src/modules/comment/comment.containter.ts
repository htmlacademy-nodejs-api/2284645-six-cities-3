import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { CommentEntity } from './comment.entity.js';
import { CommentServiceInterface } from './comment.interface.js';
import CommentService from './comment.service.js';
import { CommentModel } from '../models.js';
import { ControllerInterface } from '../../utils/controller/controller.interface.js';
import CommentController from './comment.controller.js';

const commentContainer = new Container();

commentContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
commentContainer.bind<ControllerInterface>(Component.CommentController).to(CommentController).inSingletonScope();

export { commentContainer };
