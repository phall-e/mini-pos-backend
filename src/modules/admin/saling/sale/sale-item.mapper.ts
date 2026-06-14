import { ProductMapper } from '@modules/admin/master-data/product/product.mapper';
import { CreateSaleItemRequestDto } from './dto/create-sale-item-request.dto';
import { SaleItemResponseDto } from './dto/sale-item-response.dto';
import { UpdateSaleItemRequestDto } from './dto/update-sale-item-request.dto';
import { SaleItemEntity } from './entities/sale-item.entity';

export class SaleItemMapper {
  public static async toDto(
    entity: SaleItemEntity,
  ): Promise<SaleItemResponseDto> {
    const dto = new SaleItemResponseDto();

    dto.id = entity.id;
    dto.saleId = entity.saleId;
    dto.productId = entity.productId;
    dto.quantity = Number(entity.quantity);
    dto.unitPrice = Number(entity.unitPrice);
    dto.discount = Number(entity.discount ?? 0);
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
    dto: CreateSaleItemRequestDto,
    saleId: number,
  ): SaleItemEntity {
    const entity = new SaleItemEntity();

    entity.saleId = saleId;
    entity.productId = dto.productId;
    entity.quantity = dto.quantity;
    entity.unitPrice = dto.unitPrice;
    entity.discount = dto.discount ?? 0;
    entity.note = dto.note;

    return entity;
  }

  public static toUpdateEntity(
    entity: SaleItemEntity,
    dto: UpdateSaleItemRequestDto,
  ): SaleItemEntity {
    entity.productId = dto.productId ?? entity.productId;
    entity.quantity = dto.quantity ?? entity.quantity;
    entity.unitPrice = dto.unitPrice ?? entity.unitPrice;
    entity.discount = dto.discount ?? entity.discount;
    entity.note = dto.note !== undefined ? dto.note : entity.note;

    return entity;
  }
}
