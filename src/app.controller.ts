import { Controller, Post, Req, Res, UploadedFile } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageResizeHelperService } from './helper/image-resize-helper.service';
import { createWriteStream, unlinkSync } from 'fs';
import { FileUploadService } from './file-upload/file-upload.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly imageResizeHelperService: ImageResizeHelperService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post(':filename')
  async uploadSingle(@Req() req: any, @Res() res: any): Promise<void> {
    const file = req.params.filename;

    const reqHeader = req.headers['content-type'];

    const [type, ext] = reqHeader.split('/');

    const path = `./uploads/${file}.${ext}`;

    const fileName = `${file}.${ext}`;

    const t0 = performance.now();
    // doSomething();

    const asa = await req.pipe(createWriteStream(path));
    await asa.on('finish', async () => {
      let result;

      switch (type) {
        case 'image':
          const aa = await this.imageResizeHelperService.resizeImage(asa.path);

          result = await this.fileUploadService.uploadImages(aa, fileName);

          //  upload image to s3

          break;

        default:
          const fileBuffer = Buffer.from(asa.path, 'base64');

          result = await this.fileUploadService.uploadFile(
            fileBuffer,
            fileName,
          );

        //  upload file to s3
      }
      unlinkSync(path);

      const t1 = performance.now();
      console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);

      res.send(result);
    });
  }
}
