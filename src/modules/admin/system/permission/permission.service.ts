import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleError } from '@libs/utils/handle-error.util';
import { Repository } from 'typeorm';
import { PermissionGroupSelectOptionResponseDto } from './dto/permission-group-select-option-response.dto';
import { PermissionGroupEntity } from './entities/permission-group.entity';
import { PermissionGroupMapper } from './permission-group.mapper';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionGroupEntity)
    private readonly permissionGroupRepository: Repository<PermissionGroupEntity>,
  ) {}

  public async findAllForSelection(): Promise<
    PermissionGroupSelectOptionResponseDto[]
  > {
    try {
      const permissionGroups = await this.permissionGroupRepository
        .createQueryBuilder('permissionGroup')
        .leftJoinAndSelect('permissionGroup.permissions', 'permission')
        .orderBy('permissionGroup.id', 'ASC')
        .addOrderBy('permission.id', 'ASC')
        .getMany();

      return permissionGroups.map((permissionGroup) =>
        PermissionGroupMapper.toSelectOptionDto(permissionGroup),
      );
    } catch (error) {
      handleError(error);
    }
  }
}
