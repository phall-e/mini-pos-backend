import { ApiProperty } from '@nestjs/swagger';

export class PermissionSelectOptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
