import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UomService } from './uom.service';
import { CreateUomRequestDto } from './dto/create-uom-request.dto';
import { UpdateUomRequestDto } from './dto/update-uom-request.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { UomResponseDto } from './dto/uom-response.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { UomEntity } from './entities/uom.entity';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('UOM')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/uom',
  version: '1',
})
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Post()
  @Permissions('uom-create')
  @ApiResponse({ status: 201, type: UomResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateUomRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<UomResponseDto> {
    return this.uomService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('uom-read')
  @ApiPaginatedResponse(UomResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<UomEntity, UomResponseDto>> {
    return this.uomService.list(query);
  }

  @Get(':id')
  @Permissions('uom-read')
  @ApiResponse({ status: 200, type: UomResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<UomResponseDto> {
    return this.uomService.findOne(+id);
  }

  @Put(':id')
  @Permissions('uom-edit')
  @ApiResponse({ status: 200, type: UomResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateUomRequestDto,
  ): Promise<UomResponseDto> {
    return this.uomService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('uom-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string): Promise<void> {
    return this.uomService.remove(+id);
  }
}
