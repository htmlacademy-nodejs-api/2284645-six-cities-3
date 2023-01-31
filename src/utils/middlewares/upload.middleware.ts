import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import multer, { diskStorage } from 'multer';
import mime from 'mime-types';
import { MiddlewareInterface } from '../../types/interfaces/middleware.interface';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private folder: string,
    private fieldName: string,
  ) { }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.folder,
      filename: (_req, file, callback) => {
        callback(null, `${nanoid()}.${mime.extension(file.mimetype)}`);
      }
    });

    const uploadSingleFileMiddleware = multer({
      storage: storage,
      fileFilter(_req, file, callback) {
        const allowedTypes = /(a*)(jpg|jpeg|png)$/;
        if (!(allowedTypes.test(file.originalname.toLowerCase()) && allowedTypes.test(file.mimetype.toLowerCase()))) {
          return callback(new HttpError(StatusCodes.BAD_REQUEST, 'Only .png and .jpg files are allowed', 'UploadFileMiddleware'));
        }
        return callback(null, true);
      },
    }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
