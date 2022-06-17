import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}
  static s3 = new S3();

  async uploadOne(dataBuffer: Buffer, filename: string) {
    try {
      const uploadResult = await UploadService.s3
        .upload({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: dataBuffer,
          Key: `${uuid()}-${filename}`,
        })
        .promise();
      return uploadResult;
    } catch (e) {
      throw new BadRequestException('error occured');
    }
  }

  async uploadMultiple(dataBuffer: Buffer[], filename: string) {
    try {
      const params = dataBuffer.map((data, index) => {
        return {
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: data,
          Key: `${uuid()}-${index}-${filename}`,
        };
      });

      const result = await Promise.all(
        params.map((param) => UploadService.s3.upload(param).promise()),
      );

      return result;
    } catch (e) {
      throw new BadRequestException('error occured');
    }
  }
}
