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
import { StockService } from './stock.service';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { StockResponseDto } from './dto/stock-response.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { StockEntity } from './entities/stock.entity';
import { LogActivityRequestMeta } from '@modules/admin/system/log-activity/decorators/log-activity-meta.decorator';
import type { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@ApiTags('Stock')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/stocking/stocks',
  version: '1',
})
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @Permissions('stock-create')
  @ApiResponse({ status: 201, type: StockResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateStockRequestDto,
    @CurrentUser() user: UserEntity,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<StockResponseDto> {
    return this.stockService.create(
      {
        ...dto,
        createdById: user.id,
      },
      logMeta,
    );
  }

  @Get()
  @Permissions('stock-read')
  @ApiPaginatedResponse(StockResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<StockEntity, StockResponseDto>> {
    return this.stockService.list(query);
  }

  @Get(':id')
  @Permissions('stock-read')
  @ApiResponse({ status: 200, type: StockResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<StockResponseDto> {
    return this.stockService.findOne(+id);
  }

  @Put(':id')
  @Permissions('stock-edit')
  @ApiResponse({ status: 200, type: StockResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateStockRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<StockResponseDto> {
    return this.stockService.update(+id, dto, logMeta);
  }

  @Delete(':id')
  @Permissions('stock-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(
    @Param('id') id: string,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<void> {
    return this.stockService.remove(+id, logMeta);
  }
}
