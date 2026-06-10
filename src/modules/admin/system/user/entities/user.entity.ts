import { BaseEntity } from "@database/entities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleEntity } from "../../role/entities/role.entity";

@Entity({
    schema: 'admin',
    name: 'users',
})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'username',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    username: string;

    @Column({
        name: 'email',
        type: 'varchar',
        length: '150',
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        length: '260',
        nullable: false,
    })
    password: string;

    @Column({
        name: 'telegram_chat_id',
        type: 'varchar',
        length: '100',
        nullable: true,
    })
    telegramChatId: string;

    @Column({
        name: 'otp_code',
        type: 'varchar',
        length: 6,
        nullable: true,
        default: null,
    })
    otpCode: string;

    @Column({
        name: 'is_required_opt',
        type: 'boolean',
        default: null,
        nullable: true,
    })
    isRequiredOtp: boolean;

    @Column({
        name: 'is_admin',
        type: 'boolean',
        default: null,
        nullable: true,
    })
    isAdmin: boolean;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
        nullable: true,
    })
    isActive: boolean;

    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        }
    })
    roles: Promise<RoleEntity[]>;

    constructor(partial?: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }
}
