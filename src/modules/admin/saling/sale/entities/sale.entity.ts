import { BaseEntity } from '@database/entities/base.entity';
import { Attachment } from '@libs/common/dtos/attachment';
import { CustomerEntity } from '@modules/admin/master-data/customer/entities/customer.entity';
import { PaymentSettingEntity } from '@modules/admin/system/payment-setting/entities/payment-setting.entity';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SaleItemEntity } from './sale-item.entity';

export enum SaleStatus {
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

@Entity({
  schema: 'admin',
  name: 'sales',
})
export class SaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    length: '150',
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    name: 'sale_date',
    type: 'timestamp',
    nullable: false,
  })
  saleDate: Date;

  @Column({
    name: 'customer_id',
    type: 'integer',
    nullable: false,
  })
  customerId: number;

  @ManyToOne(() => CustomerEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'customer_id',
  })
  customer: CustomerEntity;

  @Column({
    name: 'payment_type_id',
    type: 'integer',
    nullable: true,
  })
  paymentTypeId: number | null;

  @ManyToOne(() => PaymentSettingEntity, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'payment_type_id',
  })
  paymentType: PaymentSettingEntity | null;

  @Column({
    name: 'note',
    type: 'text',
    nullable: true,
  })
  note: string | null;

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

  @Column({
    name: 'attachments',
    type: 'jsonb',
    nullable: true,
  })
  attachments: Attachment[] | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: SaleStatus,
    nullable: false,
    default: SaleStatus.PENDING,
  })
  status: SaleStatus;

  @OneToMany(() => SaleItemEntity, (item) => item.sale)
  items: SaleItemEntity[];

  constructor(partial?: Partial<SaleEntity>) {
    super();
    Object.assign(this, partial);
  }
}
