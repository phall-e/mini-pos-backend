import { ApiProperty } from '@nestjs/swagger';
import { PermissionSelectOptionResponseDto } from './permission-select-option-response.dto';

export class PermissionGroupSelectOptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [PermissionSelectOptionResponseDto] })
  permissions: PermissionSelectOptionResponseDto[];
}
