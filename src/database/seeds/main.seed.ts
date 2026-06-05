import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { users } from './user.seed';
import { PermissionGroupEntity } from '@modules/admin/system/permission/entities/permission-group.entity';
import { permissions } from './permission.seed';
import { RoleEntity } from '@modules/admin/system/role/entities/role.entity';
import { roles } from './role.seed';
import { PasswordHash } from '@libs/utils/password-hash.util';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { UomEntity } from '@modules/admin/master-data/uom/entities/uom.entity';
import { uoms } from './uom.seed';
import { PermissionEntity } from '@modules/admin/system/permission/entities/permission.entity';

export default class MainSeeder implements Seeder {
  public async run(database: DataSource): Promise<void> {
    await database.manager.save(PermissionGroupEntity, permissions);

    const userHashed: Partial<UserEntity>[] = await Promise.all(
      users.map(async (item) => ({
        ...item,
        password: await PasswordHash.hash(item.password),
      })),
    );

    await database.manager.save(UserEntity, userHashed);

    await database.manager.save(RoleEntity, roles);

    const savedPermissions = await database.manager.find(PermissionEntity, {
      select: {
        id: true,
      },
    });

    await database.manager
      .createQueryBuilder()
      .insert()
      .into('admin.role_permissions')
      .values(
        savedPermissions.map((permission) => ({
          role_id: 1,
          permission_id: permission.id,
        })),
      )
      .execute();

    await database.manager
      .createQueryBuilder()
      .insert()
      .into('admin.user_roles')
      .values(
        userHashed.map((_, index) => ({
          user_id: index + 1,
          role_id: 1,
        })),
      )
      .execute();

    await database.manager.save(UomEntity, uoms);
  }
}
