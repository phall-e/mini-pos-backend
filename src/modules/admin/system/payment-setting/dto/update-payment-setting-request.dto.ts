import { PartialType } from '@nestjs/swagger';
import { CreatePaymentSettingRequestDto } from './create-payment-setting-request.dto';

export class UpdatePaymentSettingRequestDto extends PartialType(
  CreatePaymentSettingRequestDto,
) {}
