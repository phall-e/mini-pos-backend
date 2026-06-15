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
  name: 'log_activities',
})
export class LogActivityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'user_id',
    type: 'bigint',
    nullable: true,
  })
  userId: number | null;

  @ManyToOne(() => UserEntity, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity | null;

  @Column({
    name: 'module',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  module: string | null;

  @Column({
    name: 'action',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  action: string | null;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  ipAddress: string | null;

  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent: string | null;

  constructor(partial?: Partial<LogActivityEntity>) {
    super();
    Object.assign(this, partial);
  }
}
