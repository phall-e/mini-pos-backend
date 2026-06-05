import { BaseEntity } from '@database/entities/base.entity';
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
  name: 'uom',
})
export class UomEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    name: 'created_by_id',
    type: 'integer',
    nullable: false,
  })
  createdById: number;

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

  @ManyToOne(() => UserEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'created_by_id',
  })
  createdBy: UserEntity;

  constructor(partial?: Partial<UomEntity>) {
    super();
    Object.assign(this, partial);
  }
}
