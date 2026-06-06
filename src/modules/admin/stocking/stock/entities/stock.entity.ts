import { BaseEntity } from '@database/entities/base.entity';
import { ProductEntity } from '@modules/admin/master-data/product/entities/product.entity';
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
  name: 'stocks',
})
export class StockEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'product_id',
    type: 'integer',
    unique: true,
    nullable: false,
  })
  productId: number;

  @ManyToOne(() => ProductEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: ProductEntity;

  @Column({
    name: 'min_stock',
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
    nullable: false,
  })
  minStock: number;

  @Column({
    name: 'stock_adjustment',
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
    nullable: false,
  })
  stockAdjustment: number;

  @Column({
    name: 'stock_in',
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
    nullable: false,
  })
  stockIn: number;

  @Column({
    name: 'stock_out',
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
    nullable: false,
  })
  stockOut: number;

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

  constructor(partial?: Partial<StockEntity>) {
    super();
    Object.assign(this, partial);
  }
}
