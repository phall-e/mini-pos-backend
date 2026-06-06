import { ProductMapper } from '@modules/admin/master-data/product/product.mapper';
import { CreatePurchaseOrderItemRequestDto } from './dto/create-purchase-order-item-request.dto';
import { PurchaseOrderItemResponseDto } from './dto/purchase-order-item-response.dto';
import { UpdatePurchaseOrderItemRequestDto } from './dto/update-purchase-order-item-request.dto';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';

export class PurchaseOrderItemMapper {
  public static async toDto(
    entity: PurchaseOrderItemEntity,
  ): Promise<PurchaseOrderItemResponseDto> {
    const dto = new PurchaseOrderItemResponseDto();

    dto.id = entity.id;
    dto.purchaseOrderId = entity.purchaseOrderId;
    dto.productId = entity.productId;
    dto.quantity = Number(entity.quantity);
    dto.unitPrice = Number(entity.unitPrice);
    dto.note = entity.note;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.product) {
      dto.product = await ProductMapper.toDto(entity.product);
    }

    return dto;
  }

  public static toCreateEntity(
    dto: CreatePurchaseOrderItemRequestDto,
    purchaseOrderId: number,
  ): PurchaseOrderItemEntity {
    const entity = new PurchaseOrderItemEntity();

    entity.purchaseOrderId = purchaseOrderId;
    entity.productId = dto.productId;
    entity.quantity = dto.quantity;
    entity.unitPrice = dto.unitPrice;
    entity.note = dto.note;

    return entity;
  }

  public static toUpdateEntity(
    entity: PurchaseOrderItemEntity,
    dto: UpdatePurchaseOrderItemRequestDto,
  ): PurchaseOrderItemEntity {
    entity.productId = dto.productId ?? entity.productId;
    entity.quantity = dto.quantity ?? entity.quantity;
    entity.unitPrice = dto.unitPrice ?? entity.unitPrice;
    entity.note = dto.note !== undefined ? dto.note : entity.note;

    return entity;
  }
}
