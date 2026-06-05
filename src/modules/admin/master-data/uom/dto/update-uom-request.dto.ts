import { PartialType } from '@nestjs/swagger';
import { CreateUomRequestDto } from './create-uom-request.dto';

export class UpdateUomRequestDto extends PartialType(CreateUomRequestDto) {}
