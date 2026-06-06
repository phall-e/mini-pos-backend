import { PartialType } from '@nestjs/swagger';
import { CreateVendorRequestDto } from './create-vendor-request.dto';

export class UpdateVendorRequestDto extends PartialType(CreateVendorRequestDto) {}
