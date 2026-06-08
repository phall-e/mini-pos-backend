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
    nullable: false,
  })
  bankAccount: string;

  @Column({
    name: 'merchant_name',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  merchantName: string;

  @Column({
    name: 'merchant_city',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  merchantCity: string;

  @Column({
    name: 'amount',
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    name: 'currency',
    type: 'enum',
    enum: PaymentSettingCurrency,
    nullable: false,
  })
  currency: PaymentSettingCurrency;

  @Column({
    name: 'store_label',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  storeLabel: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: '50',
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    name: 'bill_number',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  billNumber: string;

  @Column({
    name: 'terminal_label',
    type: 'varchar',
    length: '150',
    nullable: false,
  })
  terminalLabel: string;

  @Column({
    name: 'merchant_category_code',
    type: 'varchar',
    length: '50',
    nullable: false,
    default: '5999',
  })
  merchantCategoryCode: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  isActive: boolean;

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
