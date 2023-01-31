import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/enums/http-method.enum.js';
import { Controller } from '../../utils/controller/controller.js';
import HttpError from '../../utils/errors/http-error.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { CreateRentalOfferDto, UpdateRentalOfferDto } from './dto/rental-offer.dto.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';
import { RentalOfferListResponse, RentalOfferFullResponse } from './rental-offer.response.js';
import { CommentServiceInterface } from '../comment/comment.interface.js';
import { DocumentExistsMiddleware } from '../../utils/middlewares/document-exists.middleware.js';
import { ValidateObjectIdMiddleware } from '../../utils/middlewares/objectid.middleware.js';
import { DEFAULT_HOT_OFFERS_LIMIT, DEFAULT_NEW_OFFERS_LIMIT } from './rental-offer.constant.js';
import { CommentResponse } from '../comment/comment.response.js';
import { ValidateDtoMiddleware } from '../../utils/middlewares/dto.middleware.js';

@injectable()
export default class RentalOfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.RentalOfferServiceInterface) private readonly rentalOfferService: RentalOfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/new', method: HttpMethod.Get, handler: this.getRecent });
    this.addRoute({ path: '/hot', method: HttpMethod.Get, handler: this.getHot });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremium });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateRentalOfferDto)]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.rentalOfferService, 'RentalOffer', 'id'),
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new ValidateDtoMiddleware(UpdateRentalOfferDto),
        new DocumentExistsMiddleware(this.rentalOfferService, 'RentalOffer', 'id'),
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.rentalOfferService, 'RentalOffer', 'id'),
      ]
    });
    this.addRoute({
      path: '/:id/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.rentalOfferService, 'RentalOffer', 'id'),
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.rentalOfferService.find();
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async getRecent(_req: Request, res: Response): Promise<void> {
    const result = await this.rentalOfferService.findRecent(DEFAULT_NEW_OFFERS_LIMIT);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async getHot(_req: Request, res: Response): Promise<void> {
    const result = await this.rentalOfferService.findHot(DEFAULT_HOT_OFFERS_LIMIT);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async getPremium(_req: Request, res: Response): Promise<void> {
    const result = await this.rentalOfferService.findPremium(3);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async getComments(req: Request, res: Response): Promise<void> {
    const result = await this.commentService.findByOfferId(req.params.id);
    this.ok(
      res,
      fillDTO(CommentResponse, result)
    );
  }

  public async show(req: Request, res: Response): Promise<void> {
    const existsRentalOffer = await this.rentalOfferService.findById(req.params.id);
    if (!existsRentalOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `RentalOffer with id ${req.params.id} not found.`,
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.findById(req.params.id);
    this.ok(
      res,
      fillDTO(RentalOfferFullResponse, result)
    );
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateRentalOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.rentalOfferService.create(body);
    this.created(
      res,
      fillDTO(RentalOfferFullResponse, result)
    );
  }

  public async update(req: Request, res: Response): Promise<void> {
    const existsRentalOffer = await this.rentalOfferService.findById(req.params.id);
    if (!existsRentalOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `RentalOffer with id ${req.params.id} not found.`,
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.updateById(req.params.id, req.body);
    this.ok(
      res,
      fillDTO(RentalOfferFullResponse, result)
    );
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const existsRentalOffer = await this.rentalOfferService.findById(req.params.id);
    if (!existsRentalOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `RentalOffer with id ${req.params.id} not found.`,
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.deleteById(req.params.id);
    this.ok(
      res,
      fillDTO(RentalOfferFullResponse, result)
    );
  }
}
