import { UserResponseDto } from "@modules/admin/system/user/dto/user-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { TelegramSlug } from "@modules/admin/system/telegram/entities/telegram.entity";

export class TelegramResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    telegramChatId: string;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdById: number;

    @ApiProperty()
    createdBy: UserResponseDto;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;
}