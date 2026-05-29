import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { BaseEntity } from "@database/entities/base.entity";

@Entity({
    schema: 'admin',
    name: 'permission_groups',
})
export class PermissionGroupEntity extends BaseEntity {
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

    @OneToMany(() => PermissionEntity, (permission) => permission.permssionGroup, { cascade: true })
    permissions: PermissionEntity[];

    constructor(partial?: Partial<PermissionGroupEntity>) {
        super();
        Object.assign(this, partial);
    }
}
