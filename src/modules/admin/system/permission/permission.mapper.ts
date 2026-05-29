import { PermissionResponseDto } from "./dto/permission-response.dto";
import { PermissionEntity } from "./entities/permission.entity";

export class PermissionMapper {
    public static async toDto(entity: PermissionEntity): Promise<PermissionResponseDto> {
        const dto = new PermissionResponseDto();
        
        dto.id = entity.id;
        dto.permissionGroupId = entity.permissionGroupId;
        dto.name = entity.name;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        // if (entity.permssionGroup) {
        //     dto.permissionGroup = await 
        // }
        return dto;
    }
}