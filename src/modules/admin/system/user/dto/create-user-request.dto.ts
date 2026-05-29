import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsOptional()
    isAdmin?: boolean;

    @ApiProperty()
    @IsOptional()
    isActive: boolean;

    @ApiProperty({ type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    roles: number[];

}
