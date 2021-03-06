import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageResizeHelperService } from './helper/image-resize-helper.service';
import { RequestMiddleware } from './middleware/request.middleware';
import * as Joi from 'joi';
import { FileUploadModule } from './file-upload/file-upload.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, ImageResizeHelperService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes(AppController);
  }
}
