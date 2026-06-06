import { ApiProperty } from '@nestjs/swagger';
import { CustomerGender } from '../entities/customer.entity';

export class CustomerSelectOptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;

  @ApiProperty({ enum: CustomerGender })
  gender: CustomerGender;
}
