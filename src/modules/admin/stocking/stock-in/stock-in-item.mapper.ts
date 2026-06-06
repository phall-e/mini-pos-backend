import { ProductMapper } from '@modules/admin/master-data/product/product.mapper';
import { CreateStockInItemRequestDto } from './dto/create-stock-in-item-request.dto';
import { StockInItemResponseDto } from './dto/stock-in-item-response.dto';
import { UpdateStockInItemRequestDto } from './dto/update-stock-in-item-request.dto';
import { StockInItemEntity } from './entities/stock-in-item.entity';

export class StockInItemMapper {
  public static async toDto(
    entity: StockInItemEntity,
  ): Promise<StockInItemResponseDto> {
    const dto = new StockInItemResponseDto();

    dto.id = entity.id;
    dto.stockInId = entity.stockInId;
    dto.productId = entity.productId;
    dto.quantity = Number(entity.quantity);
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
    dto: CreateStockInItemRequestDto,
    stockInId: number,
  ): StockInItemEntity {
    const entity = new StockInItemEntity();

    entity.stockInId = stockInId;
    entity.productId = dto.productId;
    entity.quantity = dto.quantity;
    entity.note = dto.note;

    return entity;
  }

  public static toUpdateEntity(
    entity: StockInItemEntity,
    dto: UpdateStockInItemRequestDto,
  ): StockInItemEntity {
    entity.productId = dto.productId ?? entity.productId;
    entity.quantity = dto.quantity ?? entity.quantity;
    entity.note = dto.note !== undefined ? dto.note : entity.note;

    return entity;
  }
}
