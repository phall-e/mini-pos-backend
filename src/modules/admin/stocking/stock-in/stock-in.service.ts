import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { CreateStockInItemRequestDto } from './dto/create-stock-in-item-request.dto';
import { CreateStockInRequestDto } from './dto/create-stock-in-request.dto';
import { StockInCodeResponseDto } from './dto/stock-in-code-response.dto';
import { StockInResponseDto } from './dto/stock-in-response.dto';
import { UpdateStockInItemRequestDto } from './dto/update-stock-in-item-request.dto';
import { UpdateStockInRequestDto } from './dto/update-stock-in-request.dto';
import { StockInItemEntity } from './entities/stock-in-item.entity';
import { StockInEntity } from './entities/stock-in.entity';
import { StockInItemMapper } from './stock-in-item.mapper';
import { StockInMapper } from './stock-in.mapper';

@Injectable()
export class StockInService extends BasePaginationCrudService<
  StockInEntity,
  StockInResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'code',
    'purchaseOrderId',
    'stockInDate',
    'invoiceReference',
    'createdById',
  ];
  protected FILTER_COLUMNS = ['code', 'purchaseOrderId', 'createdById'];
  protected SEARCHABLE_COLUMNS = ['code', 'invoiceReference', 'description'];
  protected RELATIONSIP_FIELDS = [
    'purchaseOrder',
    'purchaseOrder.vendor',
    'purchaseOrder.createdBy',
    'purchaseOrder.items',
    'purchaseOrder.items.product',
    'items',
    'items.product',
    'createdBy',
  ];
  private readonly CODE_PREFIX = 'SI';
  private readonly CODE_SEQUENCE_LENGTH = 6;

  constructor(
    @InjectRepository(StockInEntity)
    private readonly stockInRepository: Repository<StockInEntity>,
    @InjectRepository(StockInItemEntity)
    private readonly stockInItemRepository: Repository<StockInItemEntity>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  protected get repository(): Repository<StockInEntity> {
    return this.stockInRepository;
  }

  protected getMapperReponseEntityField(
    entity: StockInEntity,
  ): Promise<StockInResponseDto> {
    return StockInMapper.toDto(entity);
  }

  public async create(
    dto: CreateStockInRequestDto,
  ): Promise<StockInResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const stockIn = StockInMapper.toCreateEntity({
          ...dto,
          code: dto.code ?? (await this.generateNextCode(manager)),
        });
        const savedStockIn = await manager.save(StockInEntity, stockIn);
        const items = dto.items.map((item) =>
          StockInItemMapper.toCreateEntity(item, savedStockIn.id),
        );

        await manager.save(StockInItemEntity, items);
        await this.applyStockInItems(items, 1, dto.createdById, manager);

        return this.findEntityById(savedStockIn.id, manager);
      });

      return StockInMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async generateCode(): Promise<StockInCodeResponseDto> {
    try {
      return {
        code: await this.generateNextCode(),
      };
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<StockInResponseDto> {
    try {
      const entity = await this.findEntityById(id);
      if (!entity) {
        throw new NotFoundException('Stock in not found');
      }

      return StockInMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateStockInRequestDto,
  ): Promise<StockInResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Stock in not found');
        }

        await this.applyStockInItems(
          entity.items ?? [],
          -1,
          entity.createdById,
          manager,
        );

        const updatedEntity = StockInMapper.toUpdateEntity(entity, dto);
        const savedStockIn = await manager.save(StockInEntity, updatedEntity);

        if (dto.items !== undefined) {
          await this.syncItems(id, dto.items, manager);
        }

        const reloadedEntity = await this.findEntityById(
          savedStockIn.id,
          manager,
        );
        await this.applyStockInItems(
          reloadedEntity.items ?? [],
          1,
          reloadedEntity.createdById,
          manager,
        );

        return reloadedEntity;
      });

      return StockInMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Stock in not found');
        }

        await this.applyStockInItems(
          entity.items ?? [],
          -1,
          entity.createdById,
          manager,
        );

        if (entity.items?.length) {
          await manager.softRemove(StockInItemEntity, entity.items);
        }

        await manager.softRemove(StockInEntity, entity);
      });
    } catch (error) {
      handleError(error);
    }
  }

  private async syncItems(
    stockInId: number,
    items: UpdateStockInItemRequestDto[],
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    const existingItems = await manager.find(StockInItemEntity, {
      where: {
        stockInId,
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
        `Invalid stock in item id: ${invalidIds.join(', ')}`,
      );
    }

    const entitiesToSave = items.map((item) => {
      if (item.id) {
        return StockInItemMapper.toUpdateEntity(
          existingItemsById.get(item.id),
          item,
        );
      }

      this.validateNewItem(item);
      return StockInItemMapper.toCreateEntity(item, stockInId);
    });
    const submittedIdSet = new Set(submittedIds);
    const entitiesToRemove = existingItems.filter(
      (item) => !submittedIdSet.has(item.id),
    );

    if (entitiesToRemove.length) {
      await manager.softRemove(StockInItemEntity, entitiesToRemove);
    }

    if (entitiesToSave.length) {
      await manager.save(StockInItemEntity, entitiesToSave);
    }
  }

  private async applyStockInItems(
    items: Pick<StockInItemEntity, 'productId' | 'quantity'>[],
    multiplier: 1 | -1,
    createdById: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<void> {
    for (const item of items) {
      await this.applyStockIn(
        item.productId,
        Number(item.quantity) * multiplier,
        createdById,
        manager,
      );
    }
  }

  private async applyStockIn(
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

    stock.stockIn = Number(stock.stockIn) + quantityDelta;
    await manager.save(StockEntity, stock);
  }

  private async findEntityById(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<StockInEntity | null> {
    return manager.findOne(StockInEntity, {
      where: {
        id,
      },
      relations: {
        purchaseOrder: {
          vendor: true,
          createdBy: true,
          items: {
            product: {
              category: true,
              uom: true,
              createdBy: true,
            },
          },
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
        purchaseOrder: {
          items: {
            id: 'ASC',
          },
        },
      },
    });
  }

  private async generateNextCode(
    manager: EntityManager = this.dataSource.manager,
  ): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `${this.CODE_PREFIX}${year}`;
    const latestStockIn = await manager.findOne(StockInEntity, {
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
    const latestSequence = latestStockIn
      ? Number(latestStockIn.code.slice(prefix.length))
      : 0;
    const nextSequence = latestSequence + 1;

    return `${prefix}${nextSequence
      .toString()
      .padStart(this.CODE_SEQUENCE_LENGTH, '0')}`;
  }

  private validateNewItem(
    item: UpdateStockInItemRequestDto,
  ): asserts item is CreateStockInItemRequestDto {
    if (item.productId === undefined || item.quantity === undefined) {
      throw new BadRequestException(
        'New stock in items require productId and quantity',
      );
    }
  }
}
