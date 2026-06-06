import { PartialType } from '@nestjs/swagger';
import { CreateStockAdjustmentRequestDto } from './create-stock-adjustment-request.dto';

export class UpdateStockAdjustmentRequestDto extends PartialType(
  CreateStockAdjustmentRequestDto,
) {}
