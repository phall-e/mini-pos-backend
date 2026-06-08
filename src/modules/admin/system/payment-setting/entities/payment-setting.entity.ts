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

export enum PaymentSettingCurrency {
  USD = 'usd',
  KHR = 'khr',
}

@Entity({
  schema: 'admin',
  name: 'payment_settings',
})
export class PaymentSettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'logo',
    type: 'jsonb',
    nullable: true,
  })
  logo: Attachment | null;

  @Column({
    name: 'bank_account',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  bankAccount: string | null;

  @Column({
    name: 'merchant_name',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  merchantName: string | null;

  @Column({
    name: 'merchant_city',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  merchantCity: string | null;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  amount: number | null;

  @Column({
    name: 'currency',
    type: 'enum',
    enum: PaymentSettingCurrency,
    nullable: true,
  })
  currency: PaymentSettingCurrency | null;

  @Column({
    name: 'store_label',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  storeLabel: string | null;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  phoneNumber: string | null;

  @Column({
    name: 'bill_number',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  billNumber: string | null;

  @Column({
    name: 'terminal_label',
    type: 'varchar',
    length: '150',
    nullable: true,
  })
  terminalLabel: string | null;

  @Column({
    name: 'merchant_category_code',
    type: 'varchar',
    length: '50',
    nullable: true,
    default: '5999',
  })
  merchantCategoryCode: string | null;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'is_cashed',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isCashed: boolean;

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

  constructor(partial?: Partial<PaymentSettingEntity>) {
    super();
    Object.assign(this, partial);
  }
}
