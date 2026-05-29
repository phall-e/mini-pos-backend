import { ApiProperty } from "@nestjs/swagger";

export class UserPayloadResponseDto {
    @ApiProperty()
    id: number

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty({
        type: () => [String],
    })
    roles: string[];

    @ApiProperty({
        type: () => [String],
    })
    permissions: string[];

}