import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MimeTypes } from 'src/enums/mime-types.enum';
import { RequestSize } from 'src/enums/request-size.enum';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestMimeType = req.headers['content-type'];

    const equals =
      MimeTypes.ImageJpeg == requestMimeType ||
      MimeTypes.ImagePng == requestMimeType ||
      MimeTypes.Pdf == requestMimeType;

    // check for supported file types
    if (!equals) {
      throw new BadRequestException('Unsupported file type');
    }

    // check for size of uploaded file
    if (Number(req.headers['content-length']) > RequestSize.maxSize) {
      throw new BadRequestException('File too large');
    }

    next();
  }
}
