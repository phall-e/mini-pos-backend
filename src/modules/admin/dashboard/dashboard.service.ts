import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../master-data/category/entities/category.entity';
import { CustomerEntity } from '../master-data/customer/entities/customer.entity';
import { ProductEntity } from '../master-data/product/entities/product.entity';
import { VendorEntity } from '../master-data/vendor/entities/vendor.entity';
import {
  PurchaseOrderEntity,
  PurchaseOrderStatus,
} from '../purchasing/purchase-order/entities/purchase-order.entity';
import { SaleEntity, SaleStatus } from '../saling/sale/entities/sale.entity';
import { StockEntity } from '../stocking/stock/entities/stock.entity';
import { UserEntity } from '../system/user/entities/user.entity';
import { DashboardLowStockResponseDto } from './dto/dashboard-low-stock-response.dto';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardSaleChartResponseDto } from './dto/dashboard-sale-chart-response.dto';
import { DashboardStatusSummaryResponseDto } from './dto/dashboard-status-summary-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(PurchaseOrderEntity)
    private readonly purchaseOrderRepository: Repository<PurchaseOrderEntity>,
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
  ) {}

  public async find(query: DashboardQueryDto): Promise<DashboardResponseDto> {
    const saleChartRange = this.getSaleChartRange(query);

    const [
      totalUser,
      totalVendor,
      totalCustomer,
      totalCategory,
      totalProduct,
      totalSaling,
      totalExpense,
      saleChart,
      lowStocks,
      purchaseOrderStatusSummary,
      saleStatusSummary,
    ] = await Promise.all([
      this.userRepository.count(),
      this.vendorRepository.count(),
      this.customerRepository.count(),
      this.categoryRepository.count(),
      this.productRepository.count(),
      this.getTotalSaling(saleChartRange),
      this.getTotalExpense(saleChartRange),
      this.getSaleChart(saleChartRange),
      this.getLowStocks(),
      this.getPurchaseOrderStatusSummary(saleChartRange),
      this.getSaleStatusSummary(saleChartRange),
    ]);

    return {
      summary: {
        totalUser,
        totalVendor,
        totalCustomer,
        totalCategory,
        totalProduct,
        totalSaling,
        totalExpense,
      },
      saleChart,
      lowStocks,
      purchaseOrderStatusSummary,
      saleStatusSummary,
    };
  }

  private async getSaleChart({
    startDate,
    endDate,
    bucketEndDate,
  }: {
    startDate: Date;
    endDate: Date;
    bucketEndDate: Date;
  }): Promise<DashboardSaleChartResponseDto[]> {
    const rows = await this.saleRepository.query<
      {
        label: string;
        month: string;
        totalSales: string;
        totalQuantity: string;
        totalAmount: string;
      }[]
    >(
      `
        SELECT
          TO_CHAR(sale_summary.month, 'YYYY-MM') AS "label",
          EXTRACT(MONTH FROM sale_summary.month)::integer AS "month",
          COUNT(*)::integer AS "totalSales",
          COALESCE(SUM(sale_summary.total_quantity), 0)::decimal AS "totalQuantity",
          COALESCE(SUM(sale_summary.total_amount), 0)::decimal AS "totalAmount"
        FROM (
          SELECT
            DATE_TRUNC('month', sale.sale_date) AS month,
            sale.id,
            COALESCE(SUM(item.quantity), 0) AS total_quantity,
            GREATEST(
              COALESCE(SUM(item.quantity * item.unit_price), 0) - COALESCE(sale.discount, 0),
              0
            ) AS total_amount
          FROM admin.sales sale
          LEFT JOIN admin.sale_items item ON item.sale_id = sale.id AND item.deleted_at IS NULL
          WHERE sale.deleted_at IS NULL
            AND sale.status != $1
            AND sale.sale_date >= $2
            AND sale.sale_date < $3
          GROUP BY DATE_TRUNC('month', sale.sale_date), sale.id, sale.discount
        ) sale_summary
        GROUP BY sale_summary.month
        ORDER BY sale_summary.month ASC
      `,
      [SaleStatus.CANCELLED, startDate, endDate],
    );

    return this.getMonthBuckets(startDate, bucketEndDate).map((bucket) => {
      const row = rows.find((item) => item.label === bucket.label);

      return {
        label: bucket.label,
        month: bucket.month,
        totalSales: Number(row?.totalSales ?? 0),
        totalQuantity: Number(row?.totalQuantity ?? 0),
        totalAmount: Number(row?.totalAmount ?? 0),
      };
    });
  }

  private async getTotalSaling({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<number> {
    const [row] = await this.saleRepository.query<{ total: string }[]>(
      `
        SELECT COALESCE(SUM(sale_summary.total_amount), 0)::decimal AS "total"
        FROM (
          SELECT
            sale.id,
            GREATEST(
              COALESCE(SUM(item.quantity * item.unit_price), 0) - COALESCE(sale.discount, 0),
              0
            ) AS total_amount
          FROM admin.sales sale
          LEFT JOIN admin.sale_items item ON item.sale_id = sale.id AND item.deleted_at IS NULL
          WHERE sale.deleted_at IS NULL
            AND sale.status != $1
            AND sale.sale_date >= $2
            AND sale.sale_date < $3
          GROUP BY sale.id, sale.discount
        ) sale_summary
      `,
      [SaleStatus.CANCELLED, startDate, endDate],
    );

    return Number(row?.total ?? 0);
  }

  private async getTotalExpense({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<number> {
    const [row] = await this.purchaseOrderRepository.query<{ total: string }[]>(
      `
        SELECT COALESCE(SUM(item.quantity * item.unit_price), 0)::decimal AS "total"
        FROM admin.purchase_orders purchase_order
        INNER JOIN admin.purchase_order_items item
          ON item.purchase_order_id = purchase_order.id
          AND item.deleted_at IS NULL
        WHERE purchase_order.deleted_at IS NULL
          AND purchase_order.status != $1
          AND purchase_order.order_date >= $2
          AND purchase_order.order_date < $3
      `,
      [PurchaseOrderStatus.CANCELLED, startDate, endDate],
    );

    return Number(row?.total ?? 0);
  }

  private async getPurchaseOrderStatusSummary({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<DashboardStatusSummaryResponseDto[]> {
    const rows = await this.purchaseOrderRepository.query<
      { status: PurchaseOrderStatus; total: string }[]
    >(
      `
        SELECT purchase_order.status AS "status", COUNT(*)::integer AS "total"
        FROM admin.purchase_orders purchase_order
        WHERE purchase_order.deleted_at IS NULL
          AND purchase_order.order_date >= $1
          AND purchase_order.order_date < $2
        GROUP BY purchase_order.status
      `,
      [startDate, endDate],
    );

    return this.mapStatusSummary(
      [
        PurchaseOrderStatus.PENDING,
        PurchaseOrderStatus.CANCELLED,
        PurchaseOrderStatus.COMPLETED,
      ],
      rows,
    );
  }

  private async getSaleStatusSummary({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }): Promise<DashboardStatusSummaryResponseDto[]> {
    const rows = await this.saleRepository.query<
      { status: SaleStatus; total: string }[]
    >(
      `
        SELECT sale.status AS "status", COUNT(*)::integer AS "total"
        FROM admin.sales sale
        WHERE sale.deleted_at IS NULL
          AND sale.sale_date >= $1
          AND sale.sale_date < $2
        GROUP BY sale.status
      `,
      [startDate, endDate],
    );

    return this.mapStatusSummary(
      [SaleStatus.PENDING, SaleStatus.CANCELLED, SaleStatus.COMPLETED],
      rows,
    );
  }

  private mapStatusSummary<TStatus extends string>(
    statuses: TStatus[],
    rows: { status: TStatus; total: string }[],
  ): DashboardStatusSummaryResponseDto[] {
    return statuses.map((status) => {
      const row = rows.find((item) => item.status === status);

      return {
        status,
        total: Number(row?.total ?? 0),
      };
    });
  }

  private getSaleChartRange(query: DashboardQueryDto): {
    startDate: Date;
    endDate: Date;
    bucketEndDate: Date;
  } {
    if (
      (query.startDate && !query.endDate) ||
      (!query.startDate && query.endDate)
    ) {
      throw new BadRequestException(
        'startDate and endDate are required together',
      );
    }

    if (query.startDate && query.endDate) {
      const startDate = new Date(query.startDate);
      const bucketEndDate = new Date(query.endDate);
      const endDate = this.toExclusiveEndDate(query.endDate);

      if (startDate > bucketEndDate) {
        throw new BadRequestException('startDate must be before endDate');
      }

      return {
        startDate,
        endDate,
        bucketEndDate,
      };
    }

    const year = query.year ?? new Date().getFullYear();

    return {
      startDate: new Date(Date.UTC(year, 0, 1)),
      endDate: new Date(Date.UTC(year + 1, 0, 1)),
      bucketEndDate: new Date(Date.UTC(year, 11, 31)),
    };
  }

  private toExclusiveEndDate(endDate: string): Date {
    const date = new Date(endDate);

    if (/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      date.setUTCDate(date.getUTCDate() + 1);
    }

    return date;
  }

  private getMonthBuckets(
    startDate: Date,
    endDate: Date,
  ): { label: string; month: number }[] {
    const buckets: { label: string; month: number }[] = [];
    const cursor = new Date(
      Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1),
    );
    const lastMonth = new Date(
      Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1),
    );

    while (cursor <= lastMonth) {
      const month = cursor.getUTCMonth() + 1;

      buckets.push({
        label: `${cursor.getUTCFullYear()}-${String(month).padStart(2, '0')}`,
        month,
      });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    return buckets;
  }

  private async getLowStocks(): Promise<DashboardLowStockResponseDto[]> {
    const rows = await this.stockRepository
      .createQueryBuilder('stock')
      .innerJoin('stock.product', 'product')
      .select('stock.id', 'stockId')
      .addSelect('stock.productId', 'productId')
      .addSelect('product.code', 'productCode')
      .addSelect('product.nameEn', 'productNameEn')
      .addSelect('product.nameKh', 'productNameKh')
      .addSelect('stock.minStock', 'minStock')
      .addSelect('stock.stockAdjustment', 'stockAdjustment')
      .addSelect('stock.stockIn', 'stockIn')
      .addSelect('stock.stockOut', 'stockOut')
      .addSelect(
        '(stock.stock_adjustment + stock.stock_in - stock.stock_out)',
        'currentStock',
      )
      .where('stock.deleted_at IS NULL')
      .andWhere('product.deleted_at IS NULL')
      .andWhere(
        '(stock.stock_adjustment + stock.stock_in - stock.stock_out) <= stock.min_stock',
      )
      .orderBy(
        '(stock.stock_adjustment + stock.stock_in - stock.stock_out)',
        'ASC',
      )
      .addOrderBy('stock.minStock', 'DESC')
      .limit(10)
      .getRawMany<{
        stockId: string;
        productId: string;
        productCode: string;
        productNameEn: string;
        productNameKh: string;
        minStock: string;
        currentStock: string;
        stockAdjustment: string;
        stockIn: string;
        stockOut: string;
      }>();

    return rows.map((row) => ({
      stockId: Number(row.stockId),
      productId: Number(row.productId),
      productCode: row.productCode,
      productNameEn: row.productNameEn,
      productNameKh: row.productNameKh,
      minStock: Number(row.minStock),
      currentStock: Number(row.currentStock),
      stockAdjustment: Number(row.stockAdjustment),
      stockIn: Number(row.stockIn),
      stockOut: Number(row.stockOut),
    }));
  }
}
