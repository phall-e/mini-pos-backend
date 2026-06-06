import { BaseEntity } from '@database/entities/base.entity';
import { Attachment } from '@libs/common/dtos/attachment';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'admin',
  name: 'vendors',
})
export class VendorEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    length: '50',
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    name: 'name_en',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  nameEn: string;

  @Column({
    name: 'name_kh',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  nameKh: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  email: string;

  @Column({
    name: 'address',
    type: 'text',
    nullable: true,
  })
  address: string;

  @Column({
    name: 'profile',
    type: 'jsonb',
    nullable: true,
  })
  profile: Attachment | null;

  @Column({
    name: 'attachments',
    type: 'jsonb',
    nullable: true,
  })
  attachments: Attachment[] | null;

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

  constructor(partial?: Partial<VendorEntity>) {
    super();
    Object.assign(this, partial);
  }
}
