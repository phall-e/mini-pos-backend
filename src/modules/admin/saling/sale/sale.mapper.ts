import { CustomerMapper } from '@modules/admin/master-data/customer/customer.mapper';
import { PaymentSettingMapper } from '@modules/admin/system/payment-setting/payment-setting.mapper';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateSaleRequestDto } from './dto/create-sale-request.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { UpdateSaleRequestDto } from './dto/update-sale-request.dto';
import { SaleEntity, SaleStatus } from './entities/sale.entity';
import { SaleItemMapper } from './sale-item.mapper';

export class SaleMapper {
  public static async toDto(entity: SaleEntity): Promise<SaleResponseDto> {
    const dto = new SaleResponseDto();

    dto.id = entity.id;
    dto.code = entity.code;
    dto.saleDate = entity.saleDate;
    dto.customerId = entity.customerId;
    dto.paymentTypeId = entity.paymentTypeId;
    dto.note = entity.note;
    dto.discount = Number(entity.discount ?? 0);
    dto.createdById = entity.createdById;
    dto.attachments = entity.attachments;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;
    dto.items = await Promise.all(
      (entity.items ?? []).map((item) => SaleItemMapper.toDto(item)),
    );
    dto.totalQuantity = dto.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const subtotalAmount = dto.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );
    dto.totalAmount = Math.max(subtotalAmount - dto.discount, 0);

    if (entity.customer) {
      dto.customer = await CustomerMapper.toDto(entity.customer);
    }

    if (entity.paymentType) {
      dto.paymentType = PaymentSettingMapper.toDto(entity.paymentType);
    }

    if (entity.createdBy) {
      dto.createdBy = UserMapper.toDto(entity.createdBy);
    }

    return dto;
  }

  public static toCreateEntity(dto: CreateSaleRequestDto): SaleEntity {
    const entity = new SaleEntity();

    entity.code = dto.code;
    entity.saleDate = new Date(dto.saleDate);
    entity.customerId = dto.customerId;
    entity.paymentTypeId = dto.paymentTypeId;
    entity.note = dto.note;
    entity.discount = dto.discount ?? 0;
    entity.createdById = dto.createdById;
    entity.attachments = dto.attachments;
    entity.status = dto.status ?? SaleStatus.PENDING;

    return entity;
  }

  public static toUpdateEntity(
    entity: SaleEntity,
    dto: UpdateSaleRequestDto,
  ): SaleEntity {
    entity.code = dto.code ?? entity.code;
    entity.saleDate = dto.saleDate ? new Date(dto.saleDate) : entity.saleDate;
    entity.customerId = dto.customerId ?? entity.customerId;
    entity.paymentTypeId =
      dto.paymentTypeId !== undefined
        ? dto.paymentTypeId
        : entity.paymentTypeId;
    entity.note = dto.note !== undefined ? dto.note : entity.note;
    entity.discount = dto.discount ?? entity.discount;
    entity.createdById = dto.createdById ?? entity.createdById;
    entity.attachments =
      dto.attachments !== undefined ? dto.attachments : entity.attachments;
    entity.status = dto.status ?? entity.status;

    return entity;
  }
}
