import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryFileResponseDto } from './dto/cloudinary-file-response.dto';
import { CloudinaryPreviewResponseDto } from './dto/cloudinary-preview-response.dto';
import { CloudinaryRemoveResponseDto } from './dto/cloudinary-remove-response.dto';

type UploadedFile = {
  buffer: Buffer;
  originalname?: string;
};

type CloudinaryResourceType = 'image' | 'video' | 'raw';

type CloudinaryDeleteResult = {
  result: string;
};

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  public async uploadFile(
    file: UploadedFile,
    folder?: string,
  ): Promise<CloudinaryFileResponseDto> {
    if (!file?.buffer) {
      throw new BadRequestException('File is required');
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (error, uploadResult) => {
          if (error) {
            reject(new Error(error.message || 'Cloudinary upload failed'));
            return;
          }

          if (!uploadResult) {
            reject(new Error('Cloudinary upload failed'));
            return;
          }

          resolve(uploadResult);
        },
      );

      stream.end(file.buffer);
    });

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      originalFilename: result.original_filename ?? file.originalname,
    };
  }

  public async removeFile(
    publicId: string,
    resourceType: CloudinaryResourceType = 'image',
  ): Promise<CloudinaryRemoveResponseDto> {
    const result = (await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    })) as CloudinaryDeleteResult;

    return {
      publicId,
      result: result.result,
    };
  }

  public getPreviewLink(
    publicId: string,
    resourceType: CloudinaryResourceType = 'image',
  ): CloudinaryPreviewResponseDto {
    return {
      publicId,
      previewUrl: cloudinary.url(publicId, {
        resource_type: resourceType,
        secure: true,
      }),
      resourceType,
    };
  }
}
