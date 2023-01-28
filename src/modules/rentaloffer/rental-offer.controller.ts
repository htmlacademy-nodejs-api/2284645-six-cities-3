import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/enums/http-method.enum.js';
import { Controller } from '../../utils/controller/controller.js';
import HttpError from '../../utils/errors/http-error.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { CreateRentalOfferDto } from './dto/rental-offer.dto.js';
import { RentalOfferServiceInterface } from './rental-offer.interface.js';
import { RentalOfferListResponse, RentalOfferFullResponse } from './rental-offer.response.js';

@injectable()
export default class RentalOfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.RentalOfferServiceInterface) private readonly rentalOfferService: RentalOfferServiceInterface,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremium });

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.get });
    this.addRoute({ path: '/:id', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:id', method: HttpMethod.Delete, handler: this.delete });
  }

  public async index(
    _req: Request,
    res: Response,
  ): Promise<void> {
    const result = await this.rentalOfferService.find();
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async getPremium(
    _req: Request,
    res: Response,
  ): Promise<void> {
    const result = await this.rentalOfferService.findPremium(3);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(RentalOfferListResponse, result)
    );
  }

  public async get(
    req: Request,
    res: Response,
  ): Promise<void> {
    const existsRentalOffer = await this.rentalOfferService.findById(req.params.id);
    if (!existsRentalOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `RentalOffer with id ${req.params.id} not found.`,
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.findById(req.params.id);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(RentalOfferFullResponse, result)
    );
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateRentalOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.rentalOfferService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(RentalOfferFullResponse, result)
    );
  }

  public async update(
    req: Request,
    res: Response,
  ): Promise<void> {
    const existsRentalOffer = await this.rentalOfferService.findById(req.params.id);
    if (!existsRentalOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `RentalOffer with id ${req.params.id} not found.`,
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.updateById(req.params.id, req.body);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(RentalOfferFullResponse, result)
    );
  }

  public async delete(
    req: Request,
    res: Response,
  ): Promise<void> {
    const existsRentalOffer = await this.rentalOfferService.findById(req.params.id);
    if (!existsRentalOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `RentalOffer with id ${req.params.id} not found.`,
        'RentalOfferController',
      );
    }

    const result = await this.rentalOfferService.deleteById(req.params.id);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(RentalOfferFullResponse, result)
    );
  }
}
