import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PermissionGroupResponseDto } from './permission-group-response.dto';

export class PermissionResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    permissionGroupId: number;

    @ApiProperty()
    permissionGroup: PermissionGroupResponseDto;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}
