import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { CreateStockAdjustmentRequestDto } from './dto/create-stock-adjustment-request.dto';
import { StockAdjustmentResponseDto } from './dto/stock-adjustment-response.dto';
import { UpdateStockAdjustmentRequestDto } from './dto/update-stock-adjustment-request.dto';
import { StockAdjustmentEntity } from './entities/stock-adjustment.entity';
import { StockAdjustmentMapper } from './stock-adjustment.mapper';

@Injectable()
export class StockAdjustmentService extends BasePaginationCrudService<
  StockAdjustmentEntity,
  StockAdjustmentResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'adjustmentDate',
    'productId',
    'quantity',
    'createdById',
  ];
  protected FILTER_COLUMNS = ['productId', 'createdById'];
  protected SEARCHABLE_COLUMNS = ['note'];
  protected RELATIONSIP_FIELDS = [
    'product',
    'product.category',
    'product.uom',
    'product.createdBy',
    'createdBy',
  ];

  constructor(
    @InjectRepository(StockAdjustmentEntity)
    private readonly stockAdjustmentRepository: Repository<StockAdjustmentEntity>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  protected get repository(): Repository<StockAdjustmentEntity> {
    return this.stockAdjustmentRepository;
  }

  protected getMapperReponseEntityField(
    entity: StockAdjustmentEntity,
  ): Promise<StockAdjustmentResponseDto> {
    return StockAdjustmentMapper.toDto(entity);
  }

  public async create(
    dto: CreateStockAdjustmentRequestDto,
  ): Promise<StockAdjustmentResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const entity = StockAdjustmentMapper.toCreateEntity(dto);
        const savedAdjustment = await manager.save(
          StockAdjustmentEntity,
          entity,
        );

        await this.applyStockAdjustment(
          dto.productId,
          dto.quantity,
          dto.createdById,
          manager,
        );

        return this.findEntityById(savedAdjustment.id, manager);
      });

      return StockAdjustmentMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<StockAdjustmentResponseDto> {
    try {
      const entity = await this.findEntityById(id);
      if (!entity) {
        throw new NotFoundException('Stock adjustment not found');
      }

      return StockAdjustmentMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateStockAdjustmentRequestDto,
  ): Promise<StockAdjustmentResponseDto> {
    try {
      const savedEntity = await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Stock adjustment not found');
        }

        const nextProductId = dto.productId ?? entity.productId;
        const nextQuantity = dto.quantity ?? Number(entity.quantity);

        await this.applyStockAdjustment(
          entity.productId,
          -Number(entity.quantity),
          entity.createdById,
          manager,
        );

        const updatedEntity = StockAdjustmentMapper.toUpdateEntity(entity, dto);
        const savedAdjustment = await manager.save(
          StockAdjustmentEntity,
          updatedEntity,
        );

        await this.applyStockAdjustment(
          nextProductId,
          nextQuantity,
          savedAdjustment.createdById,
          manager,
        );

        return this.findEntityById(savedAdjustment.id, manager);
      });

      return StockAdjustmentMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const entity = await this.findEntityById(id, manager);
        if (!entity) {
          throw new NotFoundException('Stock adjustment not found');
        }

        await this.applyStockAdjustment(
          entity.productId,
          -Number(entity.quantity),
          entity.createdById,
          manager,
        );
        await manager.softRemove(StockAdjustmentEntity, entity);
      });
    } catch (error) {
      handleError(error);
    }
  }

  private async applyStockAdjustment(
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

    stock.stockAdjustment = Number(stock.stockAdjustment) + quantityDelta;
    await manager.save(StockEntity, stock);
  }

  private async findEntityById(
    id: number,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<StockAdjustmentEntity | null> {
    return manager.findOne(StockAdjustmentEntity, {
      where: {
        id,
      },
      relations: {
        product: {
          category: true,
          uom: true,
          createdBy: true,
        },
        createdBy: true,
      },
    });
  }
}
