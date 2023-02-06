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
import { RentalOfferListResponse, RentalOfferFullResponse, UploadPreviewResponse } from './rental-offer.response.js';
import { CommentServiceInterface } from '../comment/comment.interface.js';
import { DocumentExistsMiddleware } from '../../utils/middlewares/document-exists.middleware.js';
import { ValidateObjectIdMiddleware } from '../../utils/middlewares/objectid.middleware.js';
import { CommentResponse } from '../comment/comment.response.js';
import { ValidateDtoMiddleware } from '../../utils/middlewares/dto.middleware.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { UserResponse } from '../user/user.response.js';
import { ProtectedMiddleware } from '../../utils/middlewares/protected.middleware.js';
import { cities, CityEnum } from '../../types/cities.js';
import { RentalOfferDefaults } from './rental-offer.constant.js';
import { CommentDefaults } from '../comment/comment.constant.js';
import { ConfigInterface } from '../../utils/config/config.interface.js';
import { UploadFileMiddleware } from '../../utils/middlewares/upload.middleware.js';

@injectable()
export default class RentalOfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.RentalOfferServiceInterface) private readonly rentalOfferService: RentalOfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface
  ) {
    super(logger, configService);

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/new', method: HttpMethod.Get, handler: this.showRecent });
    this.addRoute({ path: '/hot', method: HttpMethod.Get, handler: this.showHot });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares: [
        new ProtectedMiddleware(),
      ]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.showPremiumByCity });
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
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ProtectedMiddleware(),
        new ValidateDtoMiddleware(CreateRentalOfferDto),
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ProtectedMiddleware(),
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
        new ProtectedMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.rentalOfferService, 'RentalOffer', 'id'),
      ]
    });
    this.addRoute({
      path: '/:id/comments',
      method: HttpMethod.Get,
      handler: this.showComments,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.rentalOfferService, 'RentalOffer', 'id'),
      ]
    });
    this.addRoute({
      path: '/:id/favorite',
      method: HttpMethod.Post,
      handler: this.favorite,
      middlewares: [
        new ProtectedMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumentExistsMiddleware(this.rentalOfferService, 'RentalOffer', 'id'),
      ]
    });
    this.addRoute({
      path: '/:id/preview',
      method: HttpMethod.Post,
      handler: this.uploadPreview,
      middlewares: [
        new ProtectedMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new UploadFileMiddleware(`${this.configService.get('UPLOAD_FOLDER')}/previews`, 'preview')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const user = req.user ? await this.userService.findByEmail(req.user.email) : null;
    const limit = (req.query.limit && Number.isInteger(Number(req.query.limit))) ? Number(req.query.limit) : RentalOfferDefaults.OFFERS_LIMIT;
    const result = await this.rentalOfferService.find(limit, user);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async showRecent(req: Request, res: Response): Promise<void> {
    const user = req.user ? await this.userService.findByEmail(req.user.email) : null;
    const result = await this.rentalOfferService.findRecent(RentalOfferDefaults.NEW_OFFERS_LIMIT, user);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async showHot(req: Request, res: Response): Promise<void> {
    const user = req.user ? await this.userService.findByEmail(req.user.email) : null;
    const result = await this.rentalOfferService.findHot(RentalOfferDefaults.HOT_OFFERS_LIMIT, user);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async showPremiumByCity(req: Request, res: Response): Promise<void> {
    const { city, id } = req.params;
    if (Object.keys(cities).indexOf(city) === -1) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `RentalOffer with id ${id} not found.`,
        'RentalOfferController',
      );
    }
    const user = req.user ? await this.userService.findByEmail(req.user.email) : null;
    const result = await this.rentalOfferService.findPremiumByCity(<CityEnum>city, RentalOfferDefaults.PREMIUM_OFFERS_LIMIT, user);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async showFavorites(req: Request, res: Response): Promise<void> {
    const result = await this.rentalOfferService.findFavorites(req.user.id);
    this.ok(
      res,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async showComments(req: Request, res: Response): Promise<void> {
    const result = await this.commentService.findByOfferId(CommentDefaults.COMMENTS_LIMIT, req.params.id);
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

    const user = req.user ? await this.userService.findByEmail(req.user.email) : null;
    const result = await this.rentalOfferService.findById(req.params.id, user);
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
    if (existsRentalOffer.authorId._id.toHexString() !== req.user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You must be the owner of this offer to update it!',
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
    if (existsRentalOffer.authorId._id.toHexString() !== req.user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You must be the owner of this offer to delete it!',
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.deleteById(req.params.id);
    this.ok(
      res,
      fillDTO(RentalOfferFullResponse, result)
    );
  }

  public async favorite(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(req.user.email);
    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with email ${req.user.email} not found.`,
        'RentalOfferController',
      );
    }

    const rentalOffer = await this.rentalOfferService.findById(req.params.id);
    if (!rentalOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.id} not found.`,
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.favorite(user, rentalOffer._id);
    return this.ok(res, fillDTO(UserResponse, result));
  }

  public async uploadPreview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dtoPreviewImage = { previewImage: req.file?.path };
    await this.rentalOfferService.updateById(id, dtoPreviewImage);
    this.created(res, fillDTO(UploadPreviewResponse, dtoPreviewImage));
  }
}
