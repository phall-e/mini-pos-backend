import { ApiProperty } from "@nestjs/swagger";
import { PermissionResponseDto } from "./permission-response.dto";

export class PermissionGroupResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty()
    permissions: PermissionResponseDto[];
}
