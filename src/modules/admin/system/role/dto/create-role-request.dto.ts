import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: [1, 2] })
    @ArrayNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    permissions: number[];

}
