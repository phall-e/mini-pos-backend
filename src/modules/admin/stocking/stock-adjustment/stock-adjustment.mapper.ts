import { ProductMapper } from '@modules/admin/master-data/product/product.mapper';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateStockAdjustmentRequestDto } from './dto/create-stock-adjustment-request.dto';
import { StockAdjustmentResponseDto } from './dto/stock-adjustment-response.dto';
import { UpdateStockAdjustmentRequestDto } from './dto/update-stock-adjustment-request.dto';
import { StockAdjustmentEntity } from './entities/stock-adjustment.entity';

export class StockAdjustmentMapper {
  public static async toDto(
    entity: StockAdjustmentEntity,
  ): Promise<StockAdjustmentResponseDto> {
    const dto = new StockAdjustmentResponseDto();

    dto.id = entity.id;
    dto.adjustmentDate = entity.adjustmentDate;
    dto.productId = entity.productId;
    dto.quantity = Number(entity.quantity);
    dto.note = entity.note;
    dto.attachments = entity.attachments;
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

  public static toCreateEntity(
    dto: CreateStockAdjustmentRequestDto,
  ): StockAdjustmentEntity {
    const entity = new StockAdjustmentEntity();

    entity.adjustmentDate = new Date(dto.adjustmentDate);
    entity.productId = dto.productId;
    entity.quantity = dto.quantity;
    entity.note = dto.note;
    entity.attachments = dto.attachments;
    entity.createdById = dto.createdById;

    return entity;
  }

  public static toUpdateEntity(
    entity: StockAdjustmentEntity,
    dto: UpdateStockAdjustmentRequestDto,
  ): StockAdjustmentEntity {
    entity.adjustmentDate = dto.adjustmentDate
      ? new Date(dto.adjustmentDate)
      : entity.adjustmentDate;
    entity.productId = dto.productId ?? entity.productId;
    entity.quantity = dto.quantity ?? entity.quantity;
    entity.note = dto.note !== undefined ? dto.note : entity.note;
    entity.attachments =
      dto.attachments !== undefined ? dto.attachments : entity.attachments;
    entity.createdById = dto.createdById ?? entity.createdById;

    return entity;
  }
}
