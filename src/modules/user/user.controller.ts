import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { UserServiceInterface } from './user-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { createJWT, fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/enums/http-method.enum.js';
import { ConfigInterface } from '../../utils/config/config.interface.js';
import { Controller } from '../../utils/controller/controller.js';
import HttpError from '../../utils/errors/http-error.js';
import { LoggerInterface } from '../../utils/logger/logger.interface.js';
import { CreateUserDto, LoginUserDto } from './dto/user.dto.js';
import { UserResponse, TokenUserResponse, UploadAvatarResponse } from './user.response.js';
import { ValidateDtoMiddleware } from '../../utils/middlewares/dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../utils/middlewares/objectid.middleware.js';
import { UploadFileMiddleware } from '../../utils/middlewares/upload.middleware.js';
import { ProtectedMiddleware } from '../../utils/middlewares/protected.middleware.js';
import { UserDefaults } from './user.constant.js';
import { GuestMiddleware } from '../../utils/middlewares/guest.middleware.js';


@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger, configService);

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new GuestMiddleware(),
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ProtectedMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new UploadFileMiddleware(`${this.configService.get('UPLOAD_FOLDER')}/avatars`, 'avatar')
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.isLoggedIn,
    });
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDTO(UserResponse, result)
    );
  }

  public async login(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verify(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'No user found with that email and password.', 'UserController',);
    }

    const token = await createJWT(UserDefaults.JWT_ALGORITM, this.configService.get('JWT_SECRET'), {
      email: user.email,
      id: user.id
    });

    this.ok(res, fillDTO(TokenUserResponse, { email: user.email, token }));
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dtoAvatar = { avatar: req.file?.path };
    await this.userService.updateById(id, dtoAvatar);
    this.created(res, fillDTO(UploadAvatarResponse, {
      avatar: dtoAvatar.avatar?.split('upload/')[1]
    }));
  }

  public async isLoggedIn(req: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(req.user.email);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'No user found with that email!', 'UserController',);
    }
    this.ok(res, fillDTO(UserResponse, user));
  }
}
