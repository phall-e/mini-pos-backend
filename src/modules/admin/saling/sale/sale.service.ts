import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { StockEntity } from '@modules/admin/stocking/stock/entities/stock.entity';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { CreateSaleItemRequestDto } from './dto/create-sale-item-request.dto';
import { CreateSaleRequestDto } from './dto/create-sale-request.dto';
import { SaleCodeResponseDto } from './dto/sale-code-response.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { UpdateSaleItemRequestDto } from './dto/update-sale-item-request.dto';
import { UpdateSaleRequestDto } from './dto/update-sale-request.dto';
import { SaleItemEntity } from './entities/sale-item.entity';
import { SaleEntity } from './entities/sale.entity';
import { SaleItemMapper } from './sale-item.mapper';
import { SaleMapper } from './sale.mapper';

@Injectable()
export class SaleService extends BasePaginationCrudService<
  SaleEntity,
  SaleResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'code',
    'saleDate',
    'customerId',
    'paymentTypeId',
    'createdById',
    'status',
  ];
  protected FILTER_COLUMNS = [
    'code',
    'customerId',
    'paymentTypeId',
    'createdById',
    'status',
  ];
  protected SEARCHABLE_COLUMNS = ['code', 'note'];
  protected RELATIONSIP_FIELDS = [
    'customer',
    'customer.createdBy',
    'paymentType',
    'paymentType.createdBy',
    'items',
    'items.product',
    'createdBy',
  ];
  private readonly CODE_PREFIX = 'SL';
  private readonly CODE_SEQUENCE_LENGTH = 6;

  constructor(
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  protected get repository(): Repository<SaleEntity> {
    return this.saleRepository;
  }

  protected getMapperReponseEntityField(
    entity: SaleEntity,
  ): Promise<SaleResponseDto> {
    return SaleMapper.toDto(entity);
  }

  public async create(dto: CreateSaleRequestDto): Promise<SaleResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const sale = SaleMapper.toCreateEntity({
          ...dto,
          code: dto.code ?? (await this.generateNextCode(manager)),
        });
        const savedSale = await manager.save(SaleEntity, sale);
        const items = dto.items.map((item) =>
          SaleItemMapper.toCreateEntity(item, savedSale.id),
        );

        await manager.save(SaleItemEntity, items);
        await this.applySaleItems(items, 1, dto.createdById, manager);

        return this.findEntityById(savedSale.id, manager);
      });

      return SaleMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async generateCode(): Promise<SaleCodeResponseDto> {
    try {
      return {
        code: await this.generateNextCode(),
      };
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<SaleResponseDto> {
    try {
      const entity = await this.findEntityById(id);
      if (!entity) {
        throw new NotFoundException('Sale not found');
      }

      return SaleMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateSaleRequestDto,
  ): Promise<SaleResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Sale not found');
        }

        await this.applySaleItems(
          entity.items ?? [],
          -1,
          entity.createdById,
          manager,
        );

        const updatedEntity = SaleMapper.toUpdateEntity(entity, dto);
        const savedSale = await manager.save(SaleEntity, updatedEntity);

        if (dto.items !== undefined) {
          await this.syncItems(id, dto.items, manager);
        }

        const reloadedEntity = await this.findEntityById(savedSale.id, manager);
        await this.applySaleItems(
          reloadedEntity.items ?? [],
          1,
          reloadedEntity.createdById,
          manager,
        );

        return reloadedEntity;
      });

      return SaleMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Sale not found');
        }

        await this.applySaleItems(
          entity.items ?? [],
          -1,
          entity.createdById,
          manager,
        );

        if (entity.items?.length) {
          await manager.softRemove(SaleItemEntity, entity.items);
        }

        await manager.softRemove(SaleEntity, entity);
      });
    } catch (error) {
      handleError(error);
    }
  }

  private async syncItems(
    saleId: number,
    items: UpdateSaleItemRequestDto[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    const existingItems = await manager.find(SaleItemEntity, {
      where: {
        saleId,
      },
    });
    const existingItemsById = new Map(
      existingItems.map((item) => [item.id, item]),
    );
    const submittedIds = items
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined);
    const invalidIds = submittedIds.filter((id) => !existingItemsById.has(id));

    if (invalidIds.length) {
      throw new BadRequestException(
        `Invalid sale item id: ${invalidIds.join(', ')}`,
      );
    }

    const entitiesToSave = items.map((item) => {
      if (item.id) {
        return SaleItemMapper.toUpdateEntity(
          existingItemsById.get(item.id),
          item,
        );
      }

      this.validateNewItem(item);
      return SaleItemMapper.toCreateEntity(item, saleId);
    });
    const submittedIdSet = new Set(submittedIds);
    const entitiesToRemove = existingItems.filter(
      (item) => !submittedIdSet.has(item.id),
    );

    if (entitiesToRemove.length) {
      await manager.softRemove(SaleItemEntity, entitiesToRemove);
    }

    if (entitiesToSave.length) {
      await manager.save(SaleItemEntity, entitiesToSave);
    }
  }

  private async applySaleItems(
    items: Pick<SaleItemEntity, 'productId' | 'quantity'>[],
    multiplier: 1 | -1,
    createdById: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    for (const item of items) {
      await this.applyStockOut(
        item.productId,
        Number(item.quantity) * multiplier,
        createdById,
        manager,
      );
    }
  }

  private async applyStockOut(
    productId: number,
    quantityDelta: number,
    createdById: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    let stock = await manager.findOne(StockEntity, {
      where: {
        productId,
      },
    });

    if (!stock) {
      stock = new StockEntity({
        productId,
        minStock: 0,
        stockAdjustment: 0,
        stockIn: 0,
        stockOut: 0,
        note: null,
        createdById,
      });
    }

    stock.stockOut = Number(stock.stockOut) + quantityDelta;
    await manager.save(StockEntity, stock);
  }

  private async findEntityById(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<SaleEntity | null> {
    return manager.findOne(SaleEntity, {
      where: {
        id,
      },
      relations: {
        customer: {
          createdBy: true,
        },
        paymentType: {
          createdBy: true,
        },
        items: {
          product: {
            category: true,
            uom: true,
            createdBy: true,
          },
        },
        createdBy: true,
      },
      order: {
        items: {
          id: 'ASC',
        },
      },
    });
  }

  private async generateNextCode(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `${this.CODE_PREFIX}${year}`;
    const latestSale = await manager.findOne(SaleEntity, {
      select: {
        code: true,
      },
      where: {
        code: Like(`${prefix}%`),
      },
      order: {
        code: 'DESC',
      },
    });
    const latestSequence = latestSale
      ? Number(latestSale.code.slice(prefix.length))
      : 0;
    const nextSequence = latestSequence + 1;

    return `${prefix}${nextSequence
      .toString()
      .padStart(this.CODE_SEQUENCE_LENGTH, '0')}`;
  }

  private validateNewItem(
    item: UpdateSaleItemRequestDto,
  ): asserts item is CreateSaleItemRequestDto {
    if (
      item.productId === undefined ||
      item.quantity === undefined ||
      item.unitPrice === undefined
    ) {
      throw new BadRequestException(
        'New sale items require productId, quantity, and unitPrice',
      );
    }
  }
}
