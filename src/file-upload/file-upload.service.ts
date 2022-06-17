import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {}
  static s3 = new S3();

  async uploadFile(dataBuffer: Buffer, filename: string) {
    try {
      const uploadResult = await FileUploadService.s3
        .upload({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: dataBuffer,
          Key: `./pdf/${uuid()}-${filename}`,
        })
        .promise();
      return uploadResult;
    } catch (e) {
      throw new BadRequestException('error occured');
    }
  }

  async uploadImages(dataBuffer: Buffer[], filename: string) {
    try {
      const params = dataBuffer.map((data, index) => {
        return {
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: data,
          Key: `./images/${uuid()}-${index}-${filename}`,
        };
      });

      const result = await Promise.all(
        params.map((param) => FileUploadService.s3.upload(param).promise()),
      );

      return result;
    } catch (e) {
      throw new BadRequestException('error occured');
    }
  }
}
