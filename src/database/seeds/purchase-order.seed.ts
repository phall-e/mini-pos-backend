import { PurchaseOrderStatus } from '@modules/admin/purchasing/purchase-order/entities/purchase-order.entity';

export const purchaseOrders = [
  {
    code: 'PO-001',
    orderDate: '2026-06-06',
    vendorId: 1,
    createdById: 1,
    description: 'Initial stock purchase',
    status: PurchaseOrderStatus.PENDING,
    attachments: null,
  },
  {
    code: 'PO-002',
    orderDate: '2026-06-06',
    vendorId: 2,
    createdById: 1,
    description: 'Daily goods replenishment',
    status: PurchaseOrderStatus.COMPLETED,
    attachments: null,
  },
];

export const purchaseOrderItems = [
  {
    purchaseOrderId: 1,
    productId: 1,
    quantity: 24,
    unitPrice: 0.45,
    note: null,
  },
  {
    purchaseOrderId: 1,
    productId: 2,
    quantity: 12,
    unitPrice: 0.7,
    note: null,
  },
  {
    purchaseOrderId: 2,
    productId: 3,
    quantity: 10,
    unitPrice: 1,
    note: null,
  },
];
