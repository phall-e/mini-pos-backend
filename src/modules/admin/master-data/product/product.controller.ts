import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductResponseDto } from './dto/product-response.dto';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { ProductEntity } from './entities/product.entity';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { ProductSelectOptionResponseDto } from './dto/product-select-option-response.dto';
import { LogActivityRequestMeta } from '@modules/admin/system/log-activity/decorators/log-activity-meta.decorator';
import type { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@ApiTags('Product')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/products',
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Permissions('product-create')
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateProductRequestDto,
    @CurrentUser() user: UserEntity,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<ProductResponseDto> {
    return this.productService.create(
      {
        ...dto,
        createdById: user.id,
      },
      logMeta,
    );
  }

  @Get()
  @Permissions('product-read')
  @ApiPaginatedResponse(ProductResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<ProductEntity, ProductResponseDto>> {
    return this.productService.list(query);
  }

  @Get('select-options')
  @Permissions('product-read')
  @ApiResponse({ status: 200, type: [ProductSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAllForSelection(): Promise<ProductSelectOptionResponseDto[]> {
    return this.productService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('product-read')
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @Permissions('product-edit')
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<ProductResponseDto> {
    return this.productService.update(+id, dto, logMeta);
  }

  @Delete(':id')
  @Permissions('product-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(
    @Param('id') id: string,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<void> {
    return this.productService.remove(+id, logMeta);
  }
}
