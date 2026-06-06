import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateVendorRequestDto } from './dto/create-vendor-request.dto';
import { UpdateVendorRequestDto } from './dto/update-vendor-request.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { VendorSelectOptionResponseDto } from './dto/vendor-select-option-response.dto';
import { VendorEntity } from './entities/vendor.entity';

export class VendorMapper {
  public static toDto(entity: VendorEntity): VendorResponseDto {
    const dto = new VendorResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.phoneNumber = entity.phoneNumber;
    dto.email = entity.email;
    dto.address = entity.address;
    dto.profile = entity.profile;
    dto.attachments = entity.attachments;
    dto.createdById = entity.createdById;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.createdBy) {
      dto.createdBy = UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toSelectOptionDto(
    entity: VendorEntity,
  ): VendorSelectOptionResponseDto {
    const dto = new VendorSelectOptionResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;

    return dto;
  }

  public static toCreateEntity(dto: CreateVendorRequestDto): VendorEntity {
    const entity = new VendorEntity();

    entity.code = dto.code;
    entity.nameEn = dto.nameEn;
    entity.nameKh = dto.nameKh;
    entity.phoneNumber = dto.phoneNumber;
    entity.email = dto.email;
    entity.address = dto.address;
    entity.profile = dto.profile;
    entity.attachments = dto.attachments;
    entity.createdById = dto.createdById;

    return entity;
  }

  public static toUpdateEntity(
    entity: VendorEntity,
    dto: UpdateVendorRequestDto,
  ): VendorEntity {
    entity.code = dto.code ?? entity.code;
    entity.nameEn = dto.nameEn ?? entity.nameEn;
    entity.nameKh = dto.nameKh ?? entity.nameKh;
    entity.phoneNumber = dto.phoneNumber ?? entity.phoneNumber;
    entity.email = dto.email ?? entity.email;
    entity.address = dto.address ?? entity.address;
    entity.profile = dto.profile !== undefined ? dto.profile : entity.profile;
    entity.attachments =
      dto.attachments !== undefined ? dto.attachments : entity.attachments;
    entity.createdById = dto.createdById ?? entity.createdById;

    return entity;
  }
}
