import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { CreatePurchaseOrderRequestDto } from './dto/create-purchase-order-request.dto';
import { CreatePurchaseOrderItemRequestDto } from './dto/create-purchase-order-item-request.dto';
import { PurchaseOrderCodeResponseDto } from './dto/purchase-order-code-response.dto';
import { PurchaseOrderResponseDto } from './dto/purchase-order-response.dto';
import { PurchaseOrderSelectOptionResponseDto } from './dto/purchase-order-select-option-response.dto';
import { UpdatePurchaseOrderRequestDto } from './dto/update-purchase-order-request.dto';
import { UpdatePurchaseOrderItemRequestDto } from './dto/update-purchase-order-item-request.dto';
import {
  PurchaseOrderEntity,
  PurchaseOrderStatus,
} from './entities/purchase-order.entity';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';
import { PurchaseOrderItemMapper } from './purchase-order-item-mapper';
import { PurchaseOrderMapper } from './purchase-order-mapper';

@Injectable()
export class PurchaseOrderService extends BasePaginationCrudService<
  PurchaseOrderEntity,
  PurchaseOrderResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'code',
    'orderDate',
    'vendorId',
    'createdById',
    'status',
  ];
  protected FILTER_COLUMNS = ['code', 'vendorId', 'createdById', 'status'];
  protected SEARCHABLE_COLUMNS = ['code', 'description'];
  protected RELATIONSIP_FIELDS = [
    'vendor',
    'createdBy',
    'items',
    'items.product',
  ];
  private readonly CODE_PREFIX = 'PO';
  private readonly CODE_SEQUENCE_LENGTH = 8;

  constructor(
    @InjectRepository(PurchaseOrderEntity)
    private readonly purchaseOrderRepository: Repository<PurchaseOrderEntity>,
    @InjectRepository(PurchaseOrderItemEntity)
    private readonly purchaseOrderItemRepository: Repository<PurchaseOrderItemEntity>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  protected get repository(): Repository<PurchaseOrderEntity> {
    return this.purchaseOrderRepository;
  }

  protected getMapperReponseEntityField(
    entity: PurchaseOrderEntity,
  ): Promise<PurchaseOrderResponseDto> {
    return PurchaseOrderMapper.toDto(entity);
  }

  public async create(
    dto: CreatePurchaseOrderRequestDto,
  ): Promise<PurchaseOrderResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const purchaseOrder = PurchaseOrderMapper.toCreateEntity({
          ...dto,
          code: dto.code ?? (await this.generateNextCode(manager)),
        });
        const savedPurchaseOrder = await manager.save(
          PurchaseOrderEntity,
          purchaseOrder,
        );
        const items = dto.items.map((item) =>
          PurchaseOrderItemMapper.toCreateEntity(item, savedPurchaseOrder.id),
        );

        await manager.save(PurchaseOrderItemEntity, items);

        return this.findEntityById(savedPurchaseOrder.id, manager);
      });

      return PurchaseOrderMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async generateCode(): Promise<PurchaseOrderCodeResponseDto> {
    try {
      return {
        code: await this.generateNextCode(),
      };
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<PurchaseOrderResponseDto> {
    try {
      const entity = await this.findEntityById(id);
      if (!entity) {
        throw new NotFoundException('Purchase order not found');
      }

      return PurchaseOrderMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findCompletedForSelection(): Promise<
    PurchaseOrderSelectOptionResponseDto[]
  > {
    try {
      const entities = await this.purchaseOrderRepository.find({
        where: {
          status: PurchaseOrderStatus.COMPLETED,
        },
        relations: {
          vendor: true,
        },
        order: {
          orderDate: 'DESC',
          code: 'DESC',
        },
      });

      return entities.map((entity) =>
        PurchaseOrderMapper.toSelectOptionDto(entity),
      );
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdatePurchaseOrderRequestDto,
  ): Promise<PurchaseOrderResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Purchase order not found');
        }

        const updatedEntity = PurchaseOrderMapper.toUpdateEntity(entity, dto);
        await manager.save(PurchaseOrderEntity, updatedEntity);

        if (dto.items !== undefined) {
          await this.syncItems(id, dto.items, manager);
        }

        return this.findEntityById(id, manager);
      });

      return PurchaseOrderMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Purchase order not found');
        }

        if (entity.items?.length) {
          await manager.softRemove(PurchaseOrderItemEntity, entity.items);
        }

        await manager.softRemove(PurchaseOrderEntity, entity);
      });
    } catch (error) {
      handleError(error);
    }
  }

  private async syncItems(
    purchaseOrderId: number,
    items: UpdatePurchaseOrderItemRequestDto[],
    manager = this.dataSource.manager,
  ): Promise<void> {
    const existingItems = await manager.find(PurchaseOrderItemEntity, {
      where: {
        purchaseOrderId,
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
        `Invalid purchase order item id: ${invalidIds.join(', ')}`,
      );
    }

    const entitiesToSave = items.map((item) => {
      if (item.id) {
        return PurchaseOrderItemMapper.toUpdateEntity(
          existingItemsById.get(item.id),
          item,
        );
      }

      this.validateNewItem(item);
      return PurchaseOrderItemMapper.toCreateEntity(item, purchaseOrderId);
    });
    const submittedIdSet = new Set(submittedIds);
    const entitiesToRemove = existingItems.filter(
      (item) => !submittedIdSet.has(item.id),
    );

    if (entitiesToRemove.length) {
      await manager.softRemove(PurchaseOrderItemEntity, entitiesToRemove);
    }

    if (entitiesToSave.length) {
      await manager.save(PurchaseOrderItemEntity, entitiesToSave);
    }
  }

  private async findEntityById(
    id: number,
    manager = this.dataSource.manager,
  ): Promise<PurchaseOrderEntity | null> {
    return manager.findOne(PurchaseOrderEntity, {
      where: {
        id,
      },
      relations: {
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
    const latestPurchaseOrder = await manager.findOne(PurchaseOrderEntity, {
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
    const latestSequence = latestPurchaseOrder
      ? Number(latestPurchaseOrder.code.slice(prefix.length))
      : 0;
    const nextSequence = latestSequence + 1;

    return `${prefix}${nextSequence
      .toString()
      .padStart(this.CODE_SEQUENCE_LENGTH, '0')}`;
  }

  private validateNewItem(
    item: UpdatePurchaseOrderItemRequestDto,
  ): asserts item is CreatePurchaseOrderItemRequestDto {
    if (
      item.productId === undefined ||
      item.quantity === undefined ||
      item.unitPrice === undefined
    ) {
      throw new BadRequestException(
        'New purchase order items require productId, quantity, and unitPrice',
      );
    }
  }
}
