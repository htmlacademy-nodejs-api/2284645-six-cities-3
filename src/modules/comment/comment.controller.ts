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

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.RentalOfferServiceInterface) private readonly offerService: RentalOfferServiceInterface,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateCommentDto)] });
  }

  public async create(
    { body }: Request<object, object, CreateCommentDto>,
    res: Response
  ): Promise<void> {

    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    await this.offerService.increaseCommentCount(body.offerId);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}
