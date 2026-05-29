import { RoleEntity } from "../role/entities/role.entity";
import { RoleMapper } from "../role/role.mapper";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { UserEntity } from "./entities/user.entity";

export class UserMapper {
    public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
        const dto = new UserResponseDto();

        dto.id = entity.id;
        dto.username = entity.username;
        dto.email = entity.email;
        dto.isAdmin = entity.isAdmin;
        dto.isActive = entity.isActive;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.deletedAt = entity.deletedAt;

        return dto;
    }

    public static async toDtoWithRelationship(entity: UserEntity): Promise<UserResponseDto> {
        const dto = new UserResponseDto();
        dto.id = entity.id;
        dto.username = entity.username;
        dto.isAdmin = entity.isAdmin;
        dto.isActive = entity.isActive;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        
        if (entity.roles) {
            dto.roles = await Promise.all((await entity.roles).map(RoleMapper.toDto));
        }

        return dto;
    }

    public static toCreateEntity(dto: CreateUserRequestDto): UserEntity {
        const entity = new UserEntity();

        entity.username = dto.username;
        entity.email = dto.email;
        entity.password = dto.password;
        entity.isAdmin = dto.isAdmin;
        entity.isActive = dto.isActive;
        entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
        
        return entity;
    }

    public static toUpdateEntity(entity: UserEntity, dto: UpdateUserRequestDto): UserEntity {
        entity.username = dto.username;
        entity.email = dto.email;
        entity.isAdmin = dto.isAdmin;
        entity.isActive = dto.isActive;

        return entity;
    }
}