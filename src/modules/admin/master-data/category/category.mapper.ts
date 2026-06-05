import { CategoryResponseDto } from './dto/category-response.dto';
import { CategorySelectOptionResponseDto } from './dto/category-select-option-response.dto';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { CategoryEntity } from './entities/category.entity';

export class CategoryMapper {
  public static toDto(entity: CategoryEntity): CategoryResponseDto {
    const dto = new CategoryResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.createdById = entity.createdById;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    return dto;
  }

  public static toSelectOptionDto(
    entity: CategoryEntity,
  ): CategorySelectOptionResponseDto {
    const dto = new CategorySelectOptionResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;

    return dto;
  }

  public static toCreateEntity(dto: CreateCategoryRequestDto): CategoryEntity {
    const entity = new CategoryEntity();

    entity.code = dto.code;
    entity.createdById = dto.createdById;
    entity.nameEn = dto.nameEn;
    entity.nameKh = dto.nameKh;

    return entity;
  }

  public static toUpdateEntity(
    entity: CategoryEntity,
    dto: UpdateCategoryRequestDto,
  ): CategoryEntity {
    entity.code = dto.code ?? entity.code;
    entity.createdById = dto.createdById ?? entity.createdById;
    entity.nameEn = dto.nameEn ?? entity.nameEn;
    entity.nameKh = dto.nameKh ?? entity.nameKh;

    return entity;
  }
}
