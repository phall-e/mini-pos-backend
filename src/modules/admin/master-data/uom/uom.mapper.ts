import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateUomRequestDto } from './dto/create-uom-request.dto';
import { UomResponseDto } from './dto/uom-response.dto';
import { UpdateUomRequestDto } from './dto/update-uom-request.dto';
import { UomEntity } from './entities/uom.entity';

export class UomMapper {
  public static async toDto(entity: UomEntity): Promise<UomResponseDto> {
    const dto = new UomResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.createdById = entity.createdById;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.createdBy) {
        dto.createdBy = await UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toCreateEntity(dto: CreateUomRequestDto): UomEntity {
    const entity = new UomEntity();

    entity.code = dto.code;
    entity.createdById = dto.createdById;
    entity.nameEn = dto.nameEn;
    entity.nameKh = dto.nameKh;

    return entity;
  }

  public static toUpdateEntity(
    entity: UomEntity,
    dto: UpdateUomRequestDto,
  ): UomEntity {
    entity.code = dto.code ?? entity.code;
    entity.createdById = dto.createdById ?? entity.createdById;
    entity.nameEn = dto.nameEn ?? entity.nameEn;
    entity.nameKh = dto.nameKh ?? entity.nameKh;

    return entity;
  }
}
