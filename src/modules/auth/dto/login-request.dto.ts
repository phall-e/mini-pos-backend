import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
    @ApiProperty({
        example: 'admin',
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({
        example: '123',
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}