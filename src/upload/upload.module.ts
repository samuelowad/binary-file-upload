import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService, ConfigService],
  exports: [UploadService],
})
export class UploadModule {}
