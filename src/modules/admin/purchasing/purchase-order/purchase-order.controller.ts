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
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderCodeResponseDto } from './dto/purchase-order-code-response.dto';
import { CreatePurchaseOrderRequestDto } from './dto/create-purchase-order-request.dto';
import { PurchaseOrderResponseDto } from './dto/purchase-order-response.dto';
import { PurchaseOrderSelectOptionResponseDto } from './dto/purchase-order-select-option-response.dto';
import { UpdatePurchaseOrderRequestDto } from './dto/update-purchase-order-request.dto';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { LogActivityRequestMeta } from '@modules/admin/system/log-activity/decorators/log-activity-meta.decorator';
import type { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@ApiTags('Purchase Order')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/purchasing/purchase-orders',
  version: '1',
})
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  @Permissions('purchase-order-create')
  @ApiResponse({ status: 201, type: PurchaseOrderResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreatePurchaseOrderRequestDto,
    @CurrentUser() user: UserEntity,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.create(
      {
        ...dto,
        createdById: user.id,
      },
      logMeta,
    );
  }

  @Get()
  @Permissions('purchase-order-read')
  @ApiPaginatedResponse(PurchaseOrderResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<PurchaseOrderEntity, PurchaseOrderResponseDto>> {
    return this.purchaseOrderService.list(query);
  }

  @Get('generate-code')
  @Permissions('purchase-order-create')
  @ApiResponse({ status: 200, type: PurchaseOrderCodeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public generateCode(): Promise<PurchaseOrderCodeResponseDto> {
    return this.purchaseOrderService.generateCode();
  }

  @Get('select-options/completed')
  @Permissions('purchase-order-read')
  @ApiResponse({ status: 200, type: [PurchaseOrderSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findCompletedForSelection(): Promise<
    PurchaseOrderSelectOptionResponseDto[]
  > {
    return this.purchaseOrderService.findCompletedForSelection();
  }

  @Get(':id')
  @Permissions('purchase-order-read')
  @ApiResponse({ status: 200, type: PurchaseOrderResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.findOne(+id);
  }

  @Put(':id')
  @Permissions('purchase-order-edit')
  @ApiResponse({ status: 200, type: PurchaseOrderResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseOrderRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.update(+id, dto, logMeta);
  }

  @Delete(':id')
  @Permissions('purchase-order-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(
    @Param('id') id: string,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<void> {
    return this.purchaseOrderService.remove(+id, logMeta);
  }
}
