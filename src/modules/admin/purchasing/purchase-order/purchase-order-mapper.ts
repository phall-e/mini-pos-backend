import { VendorMapper } from '@modules/admin/master-data/vendor/vendor.mapper';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreatePurchaseOrderRequestDto } from './dto/create-purchase-order-request.dto';
import { PurchaseOrderResponseDto } from './dto/purchase-order-response.dto';
import { UpdatePurchaseOrderRequestDto } from './dto/update-purchase-order-request.dto';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { PurchaseOrderItemMapper } from './purchase-order-item-mapper';

export class PurchaseOrderMapper {
  public static async toDto(
    entity: PurchaseOrderEntity,
  ): Promise<PurchaseOrderResponseDto> {
    const dto = new PurchaseOrderResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.orderDate = entity.orderDate;
    dto.vendorId = entity.vendorId;
    dto.createdById = entity.createdById;
    dto.description = entity.description;
    dto.status = entity.status;
    dto.attachments = entity.attachments;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;
    dto.items = await Promise.all(
      (entity.items ?? []).map((item) => PurchaseOrderItemMapper.toDto(item)),
    );
    dto.totalQuantity = dto.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    dto.totalAmount = dto.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );

    if (entity.vendor) {
      dto.vendor = VendorMapper.toDto(entity.vendor);
    }

    if (entity.createdBy) {
      dto.createdBy = UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toCreateEntity(
    dto: CreatePurchaseOrderRequestDto,
  ): PurchaseOrderEntity {
    const entity = new PurchaseOrderEntity();

    entity.code = dto.code;
    entity.orderDate = dto.orderDate;
    entity.vendorId = dto.vendorId;
    entity.createdById = dto.createdById;
    entity.description = dto.description;
    entity.status = dto.status;
    entity.attachments = dto.attachments;

    return entity;
  }

  public static toUpdateEntity(
    entity: PurchaseOrderEntity,
    dto: UpdatePurchaseOrderRequestDto,
  ): PurchaseOrderEntity {
    entity.code = dto.code ?? entity.code;
    entity.orderDate = dto.orderDate ?? entity.orderDate;
    entity.vendorId = dto.vendorId ?? entity.vendorId;
    entity.createdById = dto.createdById ?? entity.createdById;
    entity.description =
      dto.description !== undefined ? dto.description : entity.description;
    entity.status = dto.status ?? entity.status;
    entity.attachments =
      dto.attachments !== undefined ? dto.attachments : entity.attachments;

    return entity;
  }
}
