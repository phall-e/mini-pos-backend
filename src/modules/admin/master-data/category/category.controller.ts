import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { CategoryEntity } from './entities/category.entity';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { CategorySelectOptionResponseDto } from './dto/category-select-option-response.dto';

@ApiTags('Category')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Permissions('category-create')
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateCategoryRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('category-read')
  @ApiPaginatedResponse(CategoryResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<CategoryEntity, CategoryResponseDto>> {
    return this.categoryService.list(query);
  }

  @Get('select-options')
  @Permissions('category-read')
  @ApiResponse({ status: 200, type: [CategorySelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAllForSelection(): Promise<CategorySelectOptionResponseDto[]> {
    return this.categoryService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('category-read')
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(+id);
  }

  @Put(':id')
  @Permissions('category-edit')
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('category-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(+id);
  }
}
