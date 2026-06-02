import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryFileResponseDto } from './dto/cloudinary-file-response.dto';
import { CloudinaryPreviewResponseDto } from './dto/cloudinary-preview-response.dto';
import { CloudinaryRemoveResponseDto } from './dto/cloudinary-remove-response.dto';
import { PreviewCloudinaryFileRequestDto } from './dto/preview-cloudinary-file-request.dto';
import { RemoveCloudinaryFileRequestDto } from './dto/remove-cloudinary-file-request.dto';
import { UploadCloudinaryFileRequestDto } from './dto/upload-cloudinary-file-request.dto';

type UploadedMultipartFile = {
  buffer: Buffer;
  originalname?: string;
};

@ApiTags('Cloudinary')
@Controller({
  path: 'cloudinary',
  version: '1',
})
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          example: 'mini-pos',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, type: CloudinaryFileResponseDto })
  public uploadFile(
    @UploadedFile() file: UploadedMultipartFile,
    @Body() dto: UploadCloudinaryFileRequestDto,
  ): Promise<CloudinaryFileResponseDto> {
    return this.cloudinaryService.uploadFile(file, dto.folder);
  }

  @Delete()
  @ApiResponse({ status: 200, type: CloudinaryRemoveResponseDto })
  public removeFile(
    @Query() query: RemoveCloudinaryFileRequestDto,
  ): Promise<CloudinaryRemoveResponseDto> {
    return this.cloudinaryService.removeFile(
      query.publicId,
      query.resourceType,
    );
  }

  @Get('preview')
  @ApiResponse({ status: 200, type: CloudinaryPreviewResponseDto })
  public getPreviewLink(
    @Query() query: PreviewCloudinaryFileRequestDto,
  ): CloudinaryPreviewResponseDto {
    return this.cloudinaryService.getPreviewLink(
      query.publicId,
      query.resourceType,
    );
  }
}
