import { PurchaseOrderMapper } from '@modules/admin/purchasing/purchase-order/purchase-order-mapper';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateStockInRequestDto } from './dto/create-stock-in-request.dto';
import { StockInResponseDto } from './dto/stock-in-response.dto';
import { UpdateStockInRequestDto } from './dto/update-stock-in-request.dto';
import { StockInEntity } from './entities/stock-in.entity';
import { StockInItemMapper } from './stock-in-item.mapper';

export class StockInMapper {
  public static async toDto(
    entity: StockInEntity,
  ): Promise<StockInResponseDto> {
    const dto = new StockInResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.purchaseOrderId = entity.purchaseOrderId;
    dto.stockInDate = entity.stockInDate;
    dto.invoiceReference = entity.invoiceReference;
    dto.description = entity.description;
    dto.attachments = entity.attachments;
    dto.createdById = entity.createdById;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;
    dto.items = await Promise.all(
      (entity.items ?? []).map((item) => StockInItemMapper.toDto(item)),
    );
    dto.totalQuantity = dto.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    if (entity.purchaseOrder) {
      dto.purchaseOrder = await PurchaseOrderMapper.toDto(entity.purchaseOrder);
    }

    if (entity.createdBy) {
      dto.createdBy = UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toCreateEntity(dto: CreateStockInRequestDto): StockInEntity {
    const entity = new StockInEntity();

    entity.code = dto.code;
    entity.purchaseOrderId = dto.purchaseOrderId;
    entity.stockInDate = new Date(dto.stockInDate);
    entity.invoiceReference = dto.invoiceReference;
    entity.description = dto.description;
    entity.attachments = dto.attachments;
    entity.createdById = dto.createdById;

    return entity;
  }

  public static toUpdateEntity(
    entity: StockInEntity,
    dto: UpdateStockInRequestDto,
  ): StockInEntity {
    entity.code = dto.code ?? entity.code;
    entity.purchaseOrderId = dto.purchaseOrderId ?? entity.purchaseOrderId;
    entity.stockInDate = dto.stockInDate
      ? new Date(dto.stockInDate)
      : entity.stockInDate;
    entity.invoiceReference = dto.invoiceReference ?? entity.invoiceReference;
    entity.description =
      dto.description !== undefined ? dto.description : entity.description;
    entity.attachments =
      dto.attachments !== undefined ? dto.attachments : entity.attachments;
    entity.createdById = dto.createdById ?? entity.createdById;

    return entity;
  }
}
