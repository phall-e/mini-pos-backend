import { BaseEntity } from '@database/entities/base.entity';
import { Attachment } from '@libs/common/dtos/attachment';
import { PurchaseOrderEntity } from '@modules/admin/purchasing/purchase-order/entities/purchase-order.entity';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockInItemEntity } from './stock-in-item.entity';

@Entity({
  schema: 'admin',
  name: 'stock_ins',
})
export class StockInEntity extends BaseEntity {
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
    name: 'purchase_order_id',
    type: 'integer',
    nullable: false,
  })
  purchaseOrderId: number;

  @ManyToOne(() => PurchaseOrderEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'purchase_order_id',
  })
  purchaseOrder: PurchaseOrderEntity;

  @Column({
    name: 'stock_in_date',
    type: 'timestamp',
    nullable: false,
  })
  stockInDate: Date;

  @Column({
    name: 'invoice_reference',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  invoiceReference: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string | null;

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

  @OneToMany(() => StockInItemEntity, (item) => item.stockIn)
  items: StockInItemEntity[];

  constructor(partial?: Partial<StockInEntity>) {
    super();
    Object.assign(this, partial);
  }
}
