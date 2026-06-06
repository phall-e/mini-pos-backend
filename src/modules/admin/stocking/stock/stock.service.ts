import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { Repository } from 'typeorm';
import { CreateStockRequestDto } from './dto/create-stock-request.dto';
import { StockResponseDto } from './dto/stock-response.dto';
import { UpdateStockRequestDto } from './dto/update-stock-request.dto';
import { StockEntity } from './entities/stock.entity';
import { StockMapper } from './stock.mapper';

@Injectable()
export class StockService extends BasePaginationCrudService<
  StockEntity,
  StockResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'productId',
    'minStock',
    'stockAdjustment',
    'stockIn',
    'stockOut',
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
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<StockEntity> {
    return this.stockRepository;
  }

  protected getMapperReponseEntityField(
    entity: StockEntity,
  ): Promise<StockResponseDto> {
    return StockMapper.toDto(entity);
  }

  public async create(dto: CreateStockRequestDto): Promise<StockResponseDto> {
    try {
      const entity = StockMapper.toCreateEntity(dto);
      const savedEntity = await this.stockRepository.save(entity);
      return this.findOneEntityToDto(savedEntity.id);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<StockResponseDto> {
    try {
      return this.findOneEntityToDto(id);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateStockRequestDto,
  ): Promise<StockResponseDto> {
    try {
      const entity = await this.stockRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Stock not found');
      }

      const updatedEntity = StockMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.stockRepository.save(updatedEntity);
      return this.findOneEntityToDto(savedEntity.id);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      const entity = await this.stockRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Stock not found');
      }

      await this.stockRepository.softRemove(entity);
    } catch (error) {
      handleError(error);
    }
  }

  private async findOneEntityToDto(id: number): Promise<StockResponseDto> {
    const entity = await this.stockRepository.findOne({
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
    if (!entity) {
      throw new NotFoundException('Stock not found');
    }

    return StockMapper.toDto(entity);
  }
}
