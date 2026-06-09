import { PaymentSettingCurrency } from '@modules/admin/system/payment-setting/entities/payment-setting.entity';

export const paymentSettings = [
  {
    name: 'Is Cashed',
    logo: null,
    isActive: true,
    isCashed: true,
    createdById: 1,
  },
  {
    name: 'Main KHQR',
    logo: {
      url: 'http://res.cloudinary.com/dhlespxiv/image/upload/v1780892497/file_umupuk.png',
      bytes: 23056,
      format: 'png',
      publicId: 'file_umupuk',
      secureUrl:
        'https://res.cloudinary.com/dhlespxiv/image/upload/v1780892497/file_umupuk.png',
      resourceType: 'image',
      originalFilename: 'file',
    },
    bankAccount: 'phal_eom@aclb',
    merchantName: 'Mini POS Store',
    merchantCity: 'Phnom Penh',
    amount: 0.5,
    currency: PaymentSettingCurrency.KHR,
    storeLabel: 'Mini POS',
    phoneNumber: '0972444595',
    billNumber: 'SL-000001',
    terminalLabel: 'POS-01',
    merchantCategoryCode: '5999',
    isActive: true,
    isCashed: false,
    createdById: 1,
  },
];
