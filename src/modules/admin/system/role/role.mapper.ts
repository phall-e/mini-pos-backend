import { PermissionMapper } from '../permission/permission.mapper';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { RoleEntity } from './entities/role.entity';

export class RoleMapper {
  public static async toDto(entity: RoleEntity): Promise<RoleResponseDto> {
    const dto = new RoleResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    if (entity.permissions && (await entity.permissions).length > 0) {
      dto.permissions = await Promise.all(
        (await entity.permissions).map((item) => PermissionMapper.toDto(item)),
      );
    }

    return dto;
  }

  public static toDtoList(entities: RoleEntity[]): Promise<RoleResponseDto[]> {
    return Promise.all(entities.map((item) => this.toDto(item)));
  }

  public static toCreateEntity(dto: CreateRoleRequestDto): RoleEntity {
    const entity = new RoleEntity();
    entity.name = dto.name;

    return entity;
  }

  public static toUpdateEntity(
    entity: RoleEntity,
    dto: UpdateRoleRequestDto,
  ): RoleEntity {
    entity.name = dto.name ?? entity.name;

    return entity;
  }
}
