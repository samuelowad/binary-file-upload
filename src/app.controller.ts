import { Controller, Post, Req, Res, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageResizeService } from './helper/image-resize.helper';
import { createWriteStream, unlinkSync } from 'fs';
import { UploadService } from './upload/upload.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly imageResizeService: ImageResizeService,
    private readonly uploadService: UploadService,
  ) {}

  @Post(':filename')
  async uploadSingle(@Req() req: any, @Res() res: any): Promise<void> {
    const file = req.params.filename;

    const reqHeader = req.headers['content-type'];

    const [type, ext] = reqHeader.split('/');

    const path = `./uploads/${file}.${ext}`;

    const fileName = `${file}.${ext}`;

    const asa = await req.pipe(createWriteStream(path));
    await asa.on('finish', async () => {
      let result;

      switch (type) {
        case 'image':
          const aa = await this.imageResizeService.resizeImage(asa.path);
          result = await this.uploadService.uploadMultiple(aa, fileName);

          //  upload multiple to s3

          break;

        default:
          const fileBuffer = Buffer.from(asa.path, 'base64');

          result = await this.uploadService.uploadOne(fileBuffer, fileName);

        //  upload one to s3
      }
      unlinkSync(path);

      res.send(result);
    });
  }
}
