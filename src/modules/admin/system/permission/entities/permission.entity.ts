import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PermissionGroupEntity } from "./permission-group.entity";
import { RoleEntity } from "../../role/entities/role.entity";
import { BaseEntity } from "@database/entities/base.entity";

@Entity({
    schema: 'admin',
    name: 'permissions',
})
export class PermissionEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'permission_group_id',
        type: 'integer',
        nullable: false,
    })
    permissionGroupId: number;

    @ManyToOne(() => PermissionGroupEntity, {
        nullable: true,
    })
    @JoinColumn({
        name: 'permission_group_id',
    })
    permssionGroup: PermissionGroupEntity;

    @Column({
        name: 'name',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    name: string;

    @ManyToMany(() => RoleEntity, (role) => role.permissions)
    roles: RoleEntity[];

    constructor(partial?: Partial<PermissionEntity>) {
        super();
        Object.assign(this, partial);
    }
}
