import { ApiProperty } from "@nestjs/swagger";
import { PermissionResponseDto } from "../../permission/dto/permission-response.dto";
import { UserResponseDto } from "../../user/dto/user-response.dto";

export class RoleResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    permissions: PermissionResponseDto[];
}