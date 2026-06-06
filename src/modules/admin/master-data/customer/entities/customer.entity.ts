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

export enum CustomerGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity({
  schema: 'admin',
  name: 'customers',
})
export class CustomerEntity extends BaseEntity {
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
    name: 'gender',
    type: 'enum',
    enum: CustomerGender,
    nullable: false,
  })
  gender: CustomerGender;

  @Column({
    name: 'dob',
    type: 'date',
    nullable: true,
  })
  dob: string | null;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  phoneNumber: string | null;

  @Column({
    name: 'address',
    type: 'varchar',
    length: '250',
    nullable: true,
  })
  address: string | null;

  @Column({
    name: 'note',
    type: 'varchar',
    length: '250',
    nullable: true,
  })
  note: string | null;

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

  constructor(partial?: Partial<CustomerEntity>) {
    super();
    Object.assign(this, partial);
  }
}
