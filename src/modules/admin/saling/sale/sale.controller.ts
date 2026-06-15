import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { CreateSaleRequestDto } from './dto/create-sale-request.dto';
import { SaleCodeResponseDto } from './dto/sale-code-response.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { UpdateSaleRequestDto } from './dto/update-sale-request.dto';
import { SaleEntity } from './entities/sale.entity';
import { SaleService } from './sale.service';
import { LogActivityRequestMeta } from '@modules/admin/system/log-activity/decorators/log-activity-meta.decorator';
import type { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@ApiTags('Sale')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/saling/sales',
  version: '1',
})
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @Permissions('sale-create')
  @ApiResponse({ status: 201, type: SaleResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateSaleRequestDto,
    @CurrentUser() user: UserEntity,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<SaleResponseDto> {
    return this.saleService.create(
      {
        ...dto,
        createdById: user.id,
      },
      logMeta,
    );
  }

  @Get()
  @Permissions('sale-read')
  @ApiPaginatedResponse(SaleResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<SaleEntity, SaleResponseDto>> {
    return this.saleService.list(query);
  }

  @Get('generate-code')
  @Permissions('sale-create')
  @ApiResponse({ status: 200, type: SaleCodeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public generateCode(): Promise<SaleCodeResponseDto> {
    return this.saleService.generateCode();
  }

  @Get(':id')
  @Permissions('sale-read')
  @ApiResponse({ status: 200, type: SaleResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<SaleResponseDto> {
    return this.saleService.findOne(+id);
  }

  @Put(':id')
  @Permissions('sale-edit')
  @ApiResponse({ status: 200, type: SaleResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateSaleRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<SaleResponseDto> {
    return this.saleService.update(+id, dto, logMeta);
  }

  @Delete(':id')
  @Permissions('sale-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(
    @Param('id') id: string,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<void> {
    return this.saleService.remove(+id, logMeta);
  }
}
