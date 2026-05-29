import { PermissionGroupResponseDto } from "./dto/permission-group-response.dto";
import { PermissionGroupEntity } from "./entities/permission-group.entity";
import { PermissionMapper } from "./permission.mapper";

export class PermissionGroupMapper {
    public static async toDto(entity: PermissionGroupEntity): Promise<PermissionGroupResponseDto> {
        const dto = new PermissionGroupResponseDto();
        
        dto.id = entity.id;
        dto.name = entity.name;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        if (entity.permissions && entity.permissions.length > 0) {
            dto.permissions = await Promise.all((
                entity.permissions.map((item) => PermissionMapper.toDto(item))
            ));
        }
        return dto;
    }
}