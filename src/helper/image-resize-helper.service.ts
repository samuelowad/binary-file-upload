import { BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import { Large, Medium, Thumbnail } from 'src/enums/image-resize-types.enum';

export class ImageResizeHelperService {
  async resizeImage(imagePath: string): Promise<Buffer[]> {
    try {
      const imageBuffer = await sharp(imagePath).toBuffer();

      const funArray = [
        sharp(imageBuffer).resize(Thumbnail.w, Thumbnail.h).toBuffer(),
        sharp(imageBuffer).resize(Large.w, Large.h).toBuffer(),
        sharp(imageBuffer).resize(Medium.w, Medium.h).toBuffer(),
      ];

      const imagesBuffer: Buffer[] = await Promise.all(funArray);

      return imagesBuffer;
    } catch (err) {
      // console.log(err);

      throw new BadRequestException(err);
    }
  }
}
