import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { ProductEntity } from './entities/product.entity';
import { ProductResponseDto } from './dto/product-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMapper } from './product.mapper';
import { handleError } from '@libs/utils/handle-error.util';
import { ProductSelectOptionResponseDto } from './dto/product-select-option-response.dto';
import { LogActivityService } from '@modules/admin/system/log-activity/log-activity.service';
import { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@Injectable()
export class ProductService extends BasePaginationCrudService<
  ProductEntity,
  ProductResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'code',
    'nameEn',
    'nameKh',
    'unitPrice',
    'categoryId',
    'uomId',
    'createdById',
  ];
  protected FILTER_COLUMNS = ['code', 'categoryId', 'uomId', 'createdById'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh', 'description'];
  protected RELATIONSIP_FIELDS = ['category', 'uom', 'createdBy'];

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly logActivityService: LogActivityService,
  ) {
    super();
  }

  protected get repository(): Repository<ProductEntity> {
    return this.productRepository;
  }

  protected getMapperReponseEntityField(
    entity: ProductEntity,
  ): Promise<ProductResponseDto> {
    return Promise.resolve(ProductMapper.toDto(entity));
  }

  public async create(
    dto: CreateProductRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<ProductResponseDto> {
    try {
      const entity = ProductMapper.toCreateEntity(dto);
      const savedEntity = await this.productRepository.save(entity);
      await this.logActivityService.record({
        userId: dto.createdById,
        ...logMeta,
        module: 'product',
        action: 'create',
        description: `create Product ${savedEntity.code}`,
      });
      return ProductMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<ProductResponseDto> {
    try {
      const entity = await this.productRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Product not found');
      }

      return ProductMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<
    ProductSelectOptionResponseDto[]
  > {
    try {
      const entities = await this.productRepository.find({
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameKh: true,
        },
        order: {
          nameEn: 'ASC',
        },
      });

      return entities.map((entity) => ProductMapper.toSelectOptionDto(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateProductRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<ProductResponseDto> {
    try {
      const entity = await this.productRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Product not found');
      }

      const updatedEntity = ProductMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.productRepository.save(updatedEntity);
      await this.logActivityService.record({
        ...logMeta,
        module: 'product',
        action: 'update',
        description: `update Product ${savedEntity.code}`,
      });
      return ProductMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number, logMeta?: LogActivityMeta): Promise<void> {
    try {
      const entity = await this.productRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.softRemove(entity);
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? entity.createdById,
        module: 'product',
        action: 'delete',
        description: `delete Product ${entity.code}`,
      });
    } catch (error) {
      handleError(error);
    }
  }
}
