import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CategoryMapper } from '../category/category.mapper';
import { UomMapper } from '../uom/uom.mapper';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductSelectOptionResponseDto } from './dto/product-select-option-response.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { ProductEntity } from './entities/product.entity';

export class ProductMapper {
  public static async toDto(entity: ProductEntity): Promise<ProductResponseDto> {
    const dto = new ProductResponseDto();

    dto.id = entity.id;
    dto.categoryId = entity.categoryId;
    dto.uomId = entity.uomId;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.description = entity.description;
    dto.thumbnail = entity.thumbnail;
    dto.unitPrice = Number(entity.unitPrice);
    dto.createdById = entity.createdById;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.category) {
      dto.category = await CategoryMapper.toDto(entity.category);
    }

    if (entity.uom) {
      dto.uom = await UomMapper.toDto(entity.uom);
    }

    if (entity.createdBy) {
      dto.createdBy = await UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toSelectOptionDto(
    entity: ProductEntity,
  ): ProductSelectOptionResponseDto {
    const dto = new ProductSelectOptionResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;

    return dto;
  }

  public static toCreateEntity(dto: CreateProductRequestDto): ProductEntity {
    const entity = new ProductEntity();

    entity.categoryId = dto.categoryId;
    entity.uomId = dto.uomId;
    entity.code = dto.code;
    entity.nameEn = dto.nameEn;
    entity.nameKh = dto.nameKh;
    entity.description = dto.description;
    entity.thumbnail = dto.thumbnail;
    entity.unitPrice = dto.unitPrice;
    entity.createdById = dto.createdById;

    return entity;
  }

  public static toUpdateEntity(
    entity: ProductEntity,
    dto: UpdateProductRequestDto,
  ): ProductEntity {
    entity.categoryId = dto.categoryId ?? entity.categoryId;
    entity.uomId = dto.uomId ?? entity.uomId;
    entity.code = dto.code ?? entity.code;
    entity.nameEn = dto.nameEn ?? entity.nameEn;
    entity.nameKh = dto.nameKh ?? entity.nameKh;
    entity.description = dto.description ?? entity.description;
    entity.thumbnail = dto.thumbnail ?? entity.thumbnail;
    entity.unitPrice = dto.unitPrice ?? entity.unitPrice;
    entity.createdById = dto.createdById ?? entity.createdById;

    return entity;
  }
}
