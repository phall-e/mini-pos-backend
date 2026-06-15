import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { CreateLogActivityRequestDto } from './dto/create-log-activity-request.dto';
import { LogActivityResponseDto } from './dto/log-activity-response.dto';
import { LogActivityEntity } from './entities/log-activity.entity';

export class LogActivityMapper {
  public static async toDto(
    entity: LogActivityEntity,
  ): Promise<LogActivityResponseDto> {
    const dto = new LogActivityResponseDto();

    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.module = entity.module;
    dto.action = entity.action;
    dto.description = entity.description;
    dto.ipAddress = entity.ipAddress;
    dto.userAgent = entity.userAgent;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.user) {
      dto.user = await UserMapper.toDto(entity.user);
    }

    return dto;
  }

  public static toCreateEntity(
    dto: CreateLogActivityRequestDto,
  ): LogActivityEntity {
    const entity = new LogActivityEntity();

    entity.userId = dto.userId;
    entity.module = dto.module;
    entity.action = dto.action;
    entity.description = dto.description;
    entity.ipAddress = dto.ipAddress;
    entity.userAgent = dto.userAgent;

    return entity;
  }
}
