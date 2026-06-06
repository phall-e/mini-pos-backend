import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerSelectOptionResponseDto } from './dto/customer-select-option-response.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
import { CustomerEntity } from './entities/customer.entity';

export class CustomerMapper {
  public static async toDto(entity: CustomerEntity): Promise<CustomerResponseDto> {
    const dto = new CustomerResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.gender = entity.gender;
    dto.dob = entity.dob;
    dto.phoneNumber = entity.phoneNumber;
    dto.address = entity.address;
    dto.note = entity.note;
    dto.profile = entity.profile;
    dto.attachments = entity.attachments;
    dto.createdById = entity.createdById;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.createdBy) {
      dto.createdBy = await UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toSelectOptionDto(
    entity: CustomerEntity,
  ): CustomerSelectOptionResponseDto {
    const dto = new CustomerSelectOptionResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.nameEn = entity.nameEn;
    dto.nameKh = entity.nameKh;
    dto.gender = entity.gender;

    return dto;
  }

  public static toCreateEntity(dto: CreateCustomerRequestDto): CustomerEntity {
    const entity = new CustomerEntity();

    entity.code = dto.code;
    entity.nameEn = dto.nameEn;
    entity.nameKh = dto.nameKh;
    entity.gender = dto.gender;
    entity.dob = dto.dob;
    entity.phoneNumber = dto.phoneNumber;
    entity.address = dto.address;
    entity.note = dto.note;
    entity.profile = dto.profile;
    entity.attachments = dto.attachments;
    entity.createdById = dto.createdById;

    return entity;
  }

  public static toUpdateEntity(
    entity: CustomerEntity,
    dto: UpdateCustomerRequestDto,
  ): CustomerEntity {
    entity.code = dto.code !== undefined ? dto.code : entity.code;
    entity.nameEn = dto.nameEn ?? entity.nameEn;
    entity.nameKh = dto.nameKh ?? entity.nameKh;
    entity.gender = dto.gender ?? entity.gender;
    entity.dob = dto.dob !== undefined ? dto.dob : entity.dob;
    entity.phoneNumber =
      dto.phoneNumber !== undefined ? dto.phoneNumber : entity.phoneNumber;
    entity.address = dto.address !== undefined ? dto.address : entity.address;
    entity.note = dto.note !== undefined ? dto.note : entity.note;
    entity.profile = dto.profile !== undefined ? dto.profile : entity.profile;
    entity.attachments =
      dto.attachments !== undefined ? dto.attachments : entity.attachments;
    entity.createdById = dto.createdById ?? entity.createdById;

    return entity;
  }
}
