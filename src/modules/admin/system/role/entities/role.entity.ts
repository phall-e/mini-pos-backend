import { BaseEntity } from "@database/entities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "../../permission/entities/permission.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity({
    schema: 'admin',
    name: 'roles',
})
export class RoleEntity extends BaseEntity {

    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    name: string;

    @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { cascade: true })
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        },
    })
    permissions: Promise<PermissionEntity[]>;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];

    constructor(partial?: Partial<RoleEntity>) {
        super();
        Object.assign(this, partial);
    }
}
