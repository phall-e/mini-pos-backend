import { BaseEntity } from '@database/entities/base.entity';
import { ProductEntity } from '@modules/admin/master-data/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SaleEntity } from './sale.entity';

@Entity({
  schema: 'admin',
  name: 'sale_items',
})
export class SaleItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'sale_id',
    type: 'integer',
    nullable: false,
  })
  saleId: number;

  @ManyToOne(() => SaleEntity, (sale) => sale.items, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'sale_id',
  })
  sale: SaleEntity;

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
    name: 'unit_price',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
  })
  unitPrice: number;

  @Column({
    name: 'discount',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
    default: 0,
  })
  discount: number;

  @Column({
    name: 'note',
    type: 'text',
    nullable: true,
  })
  note: string | null;

  constructor(partial?: Partial<SaleItemEntity>) {
    super();
    Object.assign(this, partial);
  }
}
