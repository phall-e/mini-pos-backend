import { BaseEntity } from '@database/entities/base.entity';
import { ProductEntity } from '@modules/admin/master-data/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockInEntity } from './stock-in.entity';

@Entity({
  schema: 'admin',
  name: 'stock_in_items',
})
export class StockInItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'stock_in_id',
    type: 'integer',
    nullable: false,
  })
  stockInId: number;

  @ManyToOne(() => StockInEntity, (stockIn) => stockIn.items, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'stock_in_id',
  })
  stockIn: StockInEntity;

  @Column({
    name: 'product_id',
    type: 'integer',
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
    name: 'quantity',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
  })
  quantity: number;

  @Column({
    name: 'note',
    type: 'text',
    nullable: true,
  })
  note: string | null;

  constructor(partial?: Partial<StockInItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
