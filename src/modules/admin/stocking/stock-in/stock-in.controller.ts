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
import { StockInService } from './stock-in.service';
import { CreateStockInRequestDto } from './dto/create-stock-in-request.dto';
import { StockInCodeResponseDto } from './dto/stock-in-code-response.dto';
import { StockInResponseDto } from './dto/stock-in-response.dto';
import { UpdateStockInRequestDto } from './dto/update-stock-in-request.dto';
import { StockInEntity } from './entities/stock-in.entity';
import { LogActivityRequestMeta } from '@modules/admin/system/log-activity/decorators/log-activity-meta.decorator';
import type { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@ApiTags('Stock In')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/stocking/stock-ins',
  version: '1',
})
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  @Post()
  @Permissions('stock-in-create')
  @ApiResponse({ status: 201, type: StockInResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateStockInRequestDto,
    @CurrentUser() user: UserEntity,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<StockInResponseDto> {
    return this.stockInService.create(
      {
        ...dto,
        createdById: user.id,
      },
      logMeta,
    );
  }

  @Get()
  @Permissions('stock-in-read')
  @ApiPaginatedResponse(StockInResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<StockInEntity, StockInResponseDto>> {
    return this.stockInService.list(query);
  }

  @Get('generate-code')
  @Permissions('stock-in-create')
  @ApiResponse({ status: 200, type: StockInCodeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public generateCode(): Promise<StockInCodeResponseDto> {
    return this.stockInService.generateCode();
  }

  @Get(':id')
  @Permissions('stock-in-read')
  @ApiResponse({ status: 200, type: StockInResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<StockInResponseDto> {
    return this.stockInService.findOne(+id);
  }

  @Put(':id')
  @Permissions('stock-in-edit')
  @ApiResponse({ status: 200, type: StockInResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateStockInRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<StockInResponseDto> {
    return this.stockInService.update(+id, dto, logMeta);
  }

  @Delete(':id')
  @Permissions('stock-in-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(
    @Param('id') id: string,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<void> {
    return this.stockInService.remove(+id, logMeta);
  }
}
