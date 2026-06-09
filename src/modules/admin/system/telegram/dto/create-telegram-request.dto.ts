import { ApiProperty } from "@nestjs/swagger";
import { TelegramSlug } from "@modules/admin/system/telegram/entities/telegram.entity";
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateTelegramRequestDto {
    @ApiProperty({ example: 'Payment Group' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '-2345324354342' })
    @IsNotEmpty()
    @IsString()
    telegramChatId: string;

    @ApiProperty()
    @IsNotEmpty()
    slug: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    createdById: number;
    
}