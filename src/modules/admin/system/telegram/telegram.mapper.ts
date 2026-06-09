import { UserMapper } from "@modules/admin/system/user/user.mapper";
import { TelegramResponseDto } from "./dto/telegram-repsonse.dto";
import { TelegramEntity } from "./entities/telegram.entity";
import { CreateTelegramRequestDto } from "./dto/create-telegram-request.dto";
import { UpdateTelegramRequestDto } from "./dto/update-telegram-request.dto";

export class TelegramMapper {
    public static async toDto(entity: TelegramEntity): Promise<TelegramResponseDto> {
        const dto = new TelegramResponseDto();

        dto.id = entity.id;
        dto.name = entity.name;
        dto.telegramChatId = entity.telegramChatId;
        dto.slug = entity.slug;
        dto.isActive = entity.isActive;
        dto.createdById = entity.createdById;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.createdBy) {
            dto.createdBy = await UserMapper.toDto(entity.createdBy);
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateTelegramRequestDto): TelegramEntity {
        const entity = new TelegramEntity();

        entity.name = dto.name;
        entity.telegramChatId = dto.telegramChatId;
        entity.slug = dto.slug;
        entity.isActive = dto.isActive;
        entity.createdById = dto.createdById;

        return entity;
    }

    public static toUpdateEntity(entity: TelegramEntity, dto: UpdateTelegramRequestDto): TelegramEntity {
        entity.name = dto.name;
        entity.telegramChatId = dto.telegramChatId;
        entity.slug = dto.slug;
        entity.isActive = dto.isActive;

        return entity;
    }
}