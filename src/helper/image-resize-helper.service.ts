import { BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';
import { Large, Medium, Thumbnail } from 'src/enums/image-resize-types.enum';

export class ImageResizeHelperService {
  async resizeImage(imagePath: string): Promise<Buffer[]> {
    try {
      const imageBuffer = await sharp(imagePath).toBuffer();
      const thumbnail = await sharp(imageBuffer)
        .resize(Thumbnail.w, Thumbnail.h)
        .toBuffer();
      const large = await sharp(imageBuffer)
        .resize(Large.w, Large.h)
        .toBuffer();
      const medium = await sharp(imageBuffer)
        .resize(Medium.w, Medium.h)
        .toBuffer();

      return [thumbnail, large, medium];
    } catch (err) {
      // console.log(err);

      throw new BadRequestException(err);
    }
  }
}
