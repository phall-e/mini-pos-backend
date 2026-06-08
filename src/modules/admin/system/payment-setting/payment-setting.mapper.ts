import { UserMapper } from '../user/user.mapper';
import { CreatePaymentSettingRequestDto } from './dto/create-payment-setting-request.dto';
import { PaymentSettingSelectOptionResponseDto } from './dto/payment-setting-select-option-response.dto';
import { PaymentSettingResponseDto } from './dto/payment-setting-response.dto';
import { UpdatePaymentSettingRequestDto } from './dto/update-payment-setting-request.dto';
import { PaymentSettingEntity } from './entities/payment-setting.entity';

export class PaymentSettingMapper {
  public static toDto(entity: PaymentSettingEntity): PaymentSettingResponseDto {
    const dto = new PaymentSettingResponseDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.logo = entity.logo;
    dto.bankAccount = entity.bankAccount;
    dto.merchantName = entity.merchantName;
    dto.merchantCity = entity.merchantCity;
    dto.amount = entity.amount !== null ? Number(entity.amount) : null;
    dto.currency = entity.currency;
    dto.storeLabel = entity.storeLabel;
    dto.phoneNumber = entity.phoneNumber;
    dto.billNumber = entity.billNumber;
    dto.terminalLabel = entity.terminalLabel;
    dto.merchantCategoryCode = entity.merchantCategoryCode;
    dto.isActive = entity.isActive;
    dto.isCashed = entity.isCashed;
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
    entity: PaymentSettingEntity,
  ): PaymentSettingSelectOptionResponseDto {
    const dto = new PaymentSettingSelectOptionResponseDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.logo = entity.logo;
    dto.isCashed = entity.isCashed;

    return dto;
  }

  public static toCreateEntity(
    dto: CreatePaymentSettingRequestDto,
  ): PaymentSettingEntity {
    const entity = new PaymentSettingEntity();

    entity.name = dto.name;
    entity.logo = dto.logo ?? null;
    entity.bankAccount = dto.bankAccount ?? null;
    entity.merchantName = dto.merchantName ?? null;
    entity.merchantCity = dto.merchantCity ?? null;
    entity.amount = dto.amount ?? null;
    entity.currency = dto.currency ?? null;
    entity.storeLabel = dto.storeLabel ?? null;
    entity.phoneNumber = dto.phoneNumber ?? null;
    entity.billNumber = dto.billNumber ?? null;
    entity.terminalLabel = dto.terminalLabel ?? null;
    entity.merchantCategoryCode = dto.merchantCategoryCode ?? '5999';
    entity.isActive = dto.isActive ?? true;
    entity.isCashed = dto.isCashed ?? false;
    entity.createdById = dto.createdById;

    return entity;
  }

  public static toUpdateEntity(
    entity: PaymentSettingEntity,
    dto: UpdatePaymentSettingRequestDto,
  ): PaymentSettingEntity {
    entity.name = dto.name ?? entity.name;
    entity.logo = dto.logo !== undefined ? dto.logo : entity.logo;
    entity.bankAccount =
      dto.bankAccount !== undefined ? dto.bankAccount : entity.bankAccount;
    entity.merchantName =
      dto.merchantName !== undefined ? dto.merchantName : entity.merchantName;
    entity.merchantCity =
      dto.merchantCity !== undefined ? dto.merchantCity : entity.merchantCity;
    entity.amount = dto.amount !== undefined ? dto.amount : entity.amount;
    entity.currency =
      dto.currency !== undefined ? dto.currency : entity.currency;
    entity.storeLabel =
      dto.storeLabel !== undefined ? dto.storeLabel : entity.storeLabel;
    entity.phoneNumber =
      dto.phoneNumber !== undefined ? dto.phoneNumber : entity.phoneNumber;
    entity.billNumber =
      dto.billNumber !== undefined ? dto.billNumber : entity.billNumber;
    entity.terminalLabel =
      dto.terminalLabel !== undefined
        ? dto.terminalLabel
        : entity.terminalLabel;
    entity.merchantCategoryCode =
      dto.merchantCategoryCode !== undefined
        ? dto.merchantCategoryCode
        : entity.merchantCategoryCode;
    entity.isActive = dto.isActive ?? entity.isActive;
    entity.isCashed = dto.isCashed ?? entity.isCashed;
    entity.createdById = dto.createdById ?? entity.createdById;

    return entity;
  }
}
