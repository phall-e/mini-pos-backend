import { BaseEntity } from "@database/entities/base.entity";
import { UserEntity } from "@modules/admin/system/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TelegramSlug {
    RECEIPT = 'receipt',
}

@Entity({
    schema: 'admin',
    name: 'telegrams',
})

export class TelegramEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
    })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        length: '250',
        nullable: false,
    })
    name: string;

    @Column({
        name: 'telegram_chat_id',
        type: 'varchar',
        length: '250',
        unique: true,
        nullable: false,
    })
    telegramChatId: string;

    @Column({
        name: 'slug',
        type: 'varchar',
        length: '150',
        nullable: false,
    })
    slug: string;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
        nullable: false,
    })
    isActive: boolean;

    @Column({
        name: 'created_by_id',
        type: 'integer',
        nullable: false,
    })
    createdById: number;

    @ManyToOne(() => UserEntity, {
        nullable: false,
        onUpdate: 'CASCADE',
    })
    @JoinColumn({
        name: 'created_by_id',
    })
    createdBy: UserEntity;

    constructor(partial?: Partial<TelegramEntity>) {
        super();
        Object.assign(this, partial);
    }
}