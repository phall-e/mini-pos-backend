import { BaseEntity } from '@database/entities/base.entity';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { UomEntity } from '../../uom/entities/uom.entity';
import { ProductThumnailDto } from '../dto/product-thumnail.dto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  schema: 'admin',
  name: 'products',
})
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'category_id',
    type: 'integer',
    nullable: false,
  })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'category_id',
  })
  category: CategoryEntity;

  @Column({
    name: 'uom_id',
    type: 'integer',
    nullable: false,
  })
  uomId: number;

  @ManyToOne(() => UomEntity, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'uom_id',
  })
  uom: UomEntity;

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
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'thumbnail',
    type: 'jsonb',
    nullable: true,
  })
  thumbnail: ProductThumnailDto;

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

  constructor(partial?: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
