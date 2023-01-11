import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { Component } from '../../types/component.type.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentServiceInterface } from './comment.interface.js';
import CommentService from './comment.service.js';

const commentContainer = new Container();

commentContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

export { commentContainer };
