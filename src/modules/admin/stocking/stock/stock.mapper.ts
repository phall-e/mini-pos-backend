import { ProductMapper } from '@modules/admin/master-data/product/product.mapper';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { StockResponseDto } from './dto/stock-response.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { StockEntity } from './entities/stock.entity';

export class StockMapper {
  public static async toDto(entity: StockEntity): Promise<StockResponseDto> {
    const dto = new StockResponseDto();

    dto.id = entity.id;
    dto.productId = entity.productId;
    dto.minStock = Number(entity.minStock);
    dto.stockAdjustment = Number(entity.stockAdjustment);
    dto.stockIn = Number(entity.stockIn);
    dto.stockOut = Number(entity.stockOut);
    dto.currentStock = dto.stockAdjustment + dto.stockIn - dto.stockOut;
    dto.note = entity.note;
    dto.createdById = entity.createdById;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.product) {
      dto.product = await ProductMapper.toDto(entity.product);
    }

    if (entity.createdBy) {
      dto.createdBy = UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toCreateEntity(dto: CreateStockRequestDto): StockEntity {
    const entity = new StockEntity();

    entity.productId = dto.productId;
    entity.minStock = dto.minStock ?? 0;
    entity.stockAdjustment = dto.stockAdjustment ?? 0;
    entity.stockIn = dto.stockIn ?? 0;
    entity.stockOut = dto.stockOut ?? 0;
    entity.note = dto.note;
    entity.createdById = dto.createdById;

    return entity;
  }

  public static toUpdateEntity(
    entity: StockEntity,
    dto: UpdateStockRequestDto,
  ): StockEntity {
    entity.productId = dto.productId ?? entity.productId;
    entity.minStock = dto.minStock ?? entity.minStock;
    entity.stockAdjustment = dto.stockAdjustment ?? entity.stockAdjustment;
    entity.stockIn = dto.stockIn ?? entity.stockIn;
    entity.stockOut = dto.stockOut ?? entity.stockOut;
    entity.note = dto.note !== undefined ? dto.note : entity.note;
    entity.createdById = dto.createdById ?? entity.createdById;

    return entity;
  }
}
