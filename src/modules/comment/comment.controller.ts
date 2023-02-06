import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/enums/http-method.enum.js';
import { Controller } from '../../utils/controller/controller.js';
import HttpError from '../../utils/errors/http-error.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { ValidateDtoMiddleware } from '../../utils/middlewares/dto.middleware.js';
import { RentalOfferServiceInterface } from '../rentaloffer/rental-offer.interface.js';
import { CommentServiceInterface } from './comment.interface.js';
import { CreateCommentDto } from './dto/comment.dto.js';
import { CommentResponse } from './comment.response.js';
import { ProtectedMiddleware } from '../../utils/middlewares/protected.middleware.js';
import { Types } from 'mongoose';
import { ConfigInterface } from '../../utils/config/config.interface.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.RentalOfferServiceInterface) private readonly offerService: RentalOfferServiceInterface,
  ) {
    super(logger, configService);

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ProtectedMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async create(
    { body, user }: Request<object, object, CreateCommentDto>,
    res: Response
  ): Promise<void> {

    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Comment with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({ ...body, authorId: user.id });
    await this.offerService.increaseCommentCount(body.offerId);
    await this.offerService.updateRating(<Types.ObjectId>Types.ObjectId.createFromHexString(body.offerId));
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
