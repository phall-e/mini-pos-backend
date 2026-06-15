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
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { StockAdjustmentService } from './stock-adjustment.service';
import { CreateStockAdjustmentRequestDto } from './dto/create-stock-adjustment-request.dto';
import { StockAdjustmentResponseDto } from './dto/stock-adjustment-response.dto';
import { UpdateStockAdjustmentRequestDto } from './dto/update-stock-adjustment-request.dto';
import { StockAdjustmentEntity } from './entities/stock-adjustment.entity';
import { LogActivityRequestMeta } from '@modules/admin/system/log-activity/decorators/log-activity-meta.decorator';
import type { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@ApiTags('Stock Adjustment')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/stocking/stock-adjustments',
  version: '1',
})
export class StockAdjustmentController {
  constructor(
    private readonly stockAdjustmentService: StockAdjustmentService,
  ) {}

  @Post()
  @Permissions('stock-adjustment-create')
  @ApiResponse({ status: 201, type: StockAdjustmentResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateStockAdjustmentRequestDto,
    @CurrentUser() user: UserEntity,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.create(
      {
        ...dto,
        createdById: user.id,
      },
      logMeta,
    );
  }

  @Get()
  @Permissions('stock-adjustment-read')
  @ApiPaginatedResponse(StockAdjustmentResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedResponse<StockAdjustmentEntity, StockAdjustmentResponseDto>
  > {
    return this.stockAdjustmentService.list(query);
  }

  @Get(':id')
  @Permissions('stock-adjustment-read')
  @ApiResponse({ status: 200, type: StockAdjustmentResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.findOne(+id);
  }

  @Put(':id')
  @Permissions('stock-adjustment-edit')
  @ApiResponse({ status: 200, type: StockAdjustmentResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateStockAdjustmentRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<StockAdjustmentResponseDto> {
    return this.stockAdjustmentService.update(+id, dto, logMeta);
  }

  @Delete(':id')
  @Permissions('stock-adjustment-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(
    @Param('id') id: string,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<void> {
    return this.stockAdjustmentService.remove(+id, logMeta);
  }
}
