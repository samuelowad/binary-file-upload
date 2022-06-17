import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';

@Module({
  providers: [FileUploadService, ConfigService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
