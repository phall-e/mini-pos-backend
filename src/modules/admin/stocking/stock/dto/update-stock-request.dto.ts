import { PartialType } from '@nestjs/swagger';
import { CreateStockRequestDto } from './create-stock-request.dto';

export class UpdateStockRequestDto extends PartialType(CreateStockRequestDto) {}
