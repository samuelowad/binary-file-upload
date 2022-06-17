import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageResizeService } from './helper/image-resize.helper';
import { RequestMiddleware } from './middleware/request.middleware';
import * as Joi from 'joi';
import { FileUploadModule } from './file-upload/file-upload.module';
import { UploadFileModule } from './upload-file/upload-file.module';

@Module({
  imports: [
    FileUploadModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
    UploadFileModule,
  ],
  controllers: [AppController],
  providers: [AppService, ImageResizeService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes(AppController);
  }
}
