import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentSettingRequestDto } from './dto/create-payment-setting-request.dto';
import { GenerateQrCodeResponseDto } from './dto/generate-qr-code-response.dto';
import { PaymentSettingSelectOptionResponseDto } from './dto/payment-setting-select-option-response.dto';
import { PaymentSettingResponseDto } from './dto/payment-setting-response.dto';
import { UpdatePaymentSettingRequestDto } from './dto/update-payment-setting-request.dto';
import { PaymentSettingEntity } from './entities/payment-setting.entity';
import { PaymentSettingMapper } from './payment-setting.mapper';
import { GenerateQrCodeRequestDto } from './dto/generate-qr-code-request.dto';
import { TelegramService } from '@telegram/telegram.service';

const { BakongKHQR, khqrData, MerchantInfo } = require('bakong-khqr');

@Injectable()
export class PaymentSettingService extends BasePaginationCrudService<
  PaymentSettingEntity,
  PaymentSettingResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'name',
    'bankAccount',
    'merchantName',
    'merchantCity',
    'amount',
    'currency',
    'storeLabel',
    'phoneNumber',
    'billNumber',
    'terminalLabel',
    'merchantCategoryCode',
    'isActive',
    'isCashed',
    'createdById',
  ];
  protected FILTER_COLUMNS = [
    'currency',
    'isActive',
    'isCashed',
    'createdById',
  ];
  protected SEARCHABLE_COLUMNS = [
    'name',
    'bankAccount',
    'merchantName',
    'merchantCity',
    'storeLabel',
    'phoneNumber',
    'billNumber',
    'terminalLabel',
    'merchantCategoryCode',
  ];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(PaymentSettingEntity)
    private readonly paymentSettingRepository: Repository<PaymentSettingEntity>,
    private readonly telegramService: TelegramService,
  ) {
    super();
  }

  protected get repository(): Repository<PaymentSettingEntity> {
    return this.paymentSettingRepository;
  }

  protected getMapperReponseEntityField(
    entity: PaymentSettingEntity,
  ): Promise<PaymentSettingResponseDto> {
    return Promise.resolve(PaymentSettingMapper.toDto(entity));
  }

  public async create(
    dto: CreatePaymentSettingRequestDto,
  ): Promise<PaymentSettingResponseDto> {
    try {
      const entity = PaymentSettingMapper.toCreateEntity(dto);
      const savedEntity = await this.paymentSettingRepository.save(entity);
      return PaymentSettingMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<
    PaymentSettingSelectOptionResponseDto[]
  > {
    try {
      const entities = await this.paymentSettingRepository.find({
        select: {
          id: true,
          name: true,
          logo: true,
          isCashed: true,
        },
        order: {
          name: 'ASC',
        },
      });

      return entities.map((entity) =>
        PaymentSettingMapper.toSelectOptionDto(entity),
      );
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<PaymentSettingResponseDto> {
    try {
      const entity = await this.paymentSettingRepository.findOne({
        where: {
          id,
        },
        relations: {
          createdBy: true,
        },
      });
      if (!entity) {
        throw new NotFoundException('Payment setting not found');
      }

      return PaymentSettingMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdatePaymentSettingRequestDto,
  ): Promise<PaymentSettingResponseDto> {
    try {
      const entity = await this.paymentSettingRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Payment setting not found');
      }

      const updatedEntity = PaymentSettingMapper.toUpdateEntity(entity, dto);
      const savedEntity =
        await this.paymentSettingRepository.save(updatedEntity);
      return PaymentSettingMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      const entity = await this.paymentSettingRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Payment setting not found');
      }

      await this.paymentSettingRepository.softRemove(entity);
    } catch (error) {
      handleError(error);
    }
  }

  // Generate QR Code string
  public async generateQrCode(dto: GenerateQrCodeRequestDto): Promise<any> {
    try {
      const entity = await this.paymentSettingRepository.findOne({
        where: {
          id: dto.id,
          isActive: true,
        },
      });

      if (!entity) throw new NotFoundException();

      if (entity.isCashed) {
        return await PaymentSettingMapper.toDto(entity);
      }

      const optionalData = {
        currency: khqrData.currency.usd,
        amount: dto.amount,
        billNumber: dto.billNumber,
        mobileNumber: entity.phoneNumber,
        storeLabel: entity.storeLabel,
        terminalLabel: entity.terminalLabel,
        expirationTimestamp: Date.now() + 1 * 60 * 1000, // required if amount is not null or zero (eg. expired in 1 minutes)
        merchantCategoryCode: entity.merchantCategoryCode, // optional: default value 5999
      };
      const merchantInfo = new MerchantInfo(
        entity.bankAccount,
        'phall',
        entity.merchantCity,
        1243546472,
        'DEVBKKHPXXX',
        optionalData,
      );
      const khqr = new BakongKHQR();
      const response: GenerateQrCodeResponseDto =
        khqr.generateMerchant(merchantInfo);
      console.log(response);
      return {
        ...response,
        isCashed: entity.isCashed,
      };
    } catch (error) {
      handleError(error);
    }
  }

  // Verify KHQR
  public async verifyKHQR (khqr: string, saleNumber: string): Promise<boolean> {
    try {
      const KHQRString = khqr;
      const isKHQR = BakongKHQR.verify(KHQRString).isValid;
      if (!isKHQR) {
        await this.telegramService.sendMessage('1371216284', `Testing Invoice number ${saleNumber}`)
      }
      return isKHQR;
    } catch (error) {
      handleError(error);
    }
  }
}
