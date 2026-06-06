import { BaseEntity } from '@database/entities/base.entity';
import { Attachment } from '@libs/common/dtos/attachment';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { VendorEntity } from '@modules/admin/master-data/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrderItemEntity } from './purchase-order-item.entity';

export enum PurchaseOrderStatus {
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

@Entity({
  schema: 'admin',
  name: 'purchase_orders',
})
export class PurchaseOrderEntity extends BaseEntity {
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
    name: 'order_date',
    type: 'date',
    nullable: false,
  })
  orderDate: string;

  @Column({
    name: 'vendor_id',
    type: 'integer',
    nullable: false,
  })
  vendorId: number;

  @ManyToOne(() => VendorEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'vendor_id',
  })
  vendor: VendorEntity;

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
    name: 'description',
    type: 'varchar',
    length: '250',
    nullable: true,
  })
  description: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PurchaseOrderStatus,
    nullable: false,
    default: PurchaseOrderStatus.PENDING,
  })
  status: PurchaseOrderStatus;

  @Column({
    name: 'attachments',
    type: 'jsonb',
    nullable: true,
  })
  attachments: Attachment[] | null;

  @OneToMany(() => PurchaseOrderItemEntity, (item) => item.purchaseOrder)
  items: PurchaseOrderItemEntity[];

  constructor(partial?: Partial<PurchaseOrderEntity>) {
    super();
    Object.assign(this, partial);
  }
}
