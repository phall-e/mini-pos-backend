import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { RoleEntity } from './entities/role.entity';
import { RoleResponseDto } from './dto/role-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleMapper } from './role.mapper';
import { handleError } from '@libs/utils/handle-error.util';
import { RoleSelectOptionResponseDto } from './dto/role-select-option-response.dto';

@Injectable()
export class RoleService extends BasePaginationCrudService<
  RoleEntity,
  RoleResponseDto
> {
  protected SORTABLE_COLUMNS = ['id', 'name'];
  protected FILTER_COLUMNS = ['name'];
  protected SEARCHABLE_COLUMNS = ['name'];
  protected RELATIONSIP_FIELDS = ['permissions'];

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<RoleEntity> {
    return this.roleRepository;
  }

  protected getMapperReponseEntityField(
    entity: RoleEntity,
  ): Promise<RoleResponseDto> {
    return RoleMapper.toDto(entity);
  }

  public async create(dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    try {
      const entity = RoleMapper.toCreateEntity(dto);
      const savedEntity = await this.roleRepository.save(entity);

      if (dto.permissions?.length) {
        await this.roleRepository
          .createQueryBuilder()
          .relation(RoleEntity, 'permissions')
          .of(savedEntity.id)
          .add(dto.permissions);
      }

      return this.findOne(savedEntity.id);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<RoleResponseDto> {
    try {
      const entity = await this.roleRepository.findOne({
        where: {
          id,
        },
        relations: {
          permissions: true,
        },
      });
      if (!entity) {
        throw new NotFoundException('Role not found');
      }

      return RoleMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<RoleSelectOptionResponseDto[]> {
    try {
      const entities = await this.roleRepository.find({
        select: {
          id: true,
          name: true,
        },
        order: {
          name: 'ASC',
        },
      });

      return entities.map((entity) => RoleMapper.toSelectOptionDto(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    try {
      const entity = await this.roleRepository.findOne({
        where: {
          id,
        },
        relations: {
          permissions: true,
        },
      });
      if (!entity) {
        throw new NotFoundException('Role not found');
      }

      const oldPermissionIds = ((await entity.permissions) ?? []).map(
        (permission) => permission.id,
      );

      const updatedEntity = RoleMapper.toUpdateEntity(entity, dto);
      await this.roleRepository.save(updatedEntity);

      if (dto.permissions) {
        const newPermissionIds = dto.permissions;
        const permissionIdsToAdd = newPermissionIds.filter(
          (permissionId) => !oldPermissionIds.includes(permissionId),
        );
        const permissionIdsToRemove = oldPermissionIds.filter(
          (permissionId) => !newPermissionIds.includes(permissionId),
        );

        if (permissionIdsToAdd.length || permissionIdsToRemove.length) {
          await this.roleRepository
            .createQueryBuilder()
            .relation(RoleEntity, 'permissions')
            .of(id)
            .addAndRemove(permissionIdsToAdd, permissionIdsToRemove);
        }
      }

      return this.findOne(id);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      const entity = await this.roleRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Role not found');
      }

      await this.roleRepository.softRemove(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
