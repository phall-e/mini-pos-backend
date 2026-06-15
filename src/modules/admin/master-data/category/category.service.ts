import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryRequestDto } from './dto/create-category-request.dto';
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { CategoryEntity } from './entities/category.entity';
import { CategoryResponseDto } from './dto/category-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryMapper } from './category.mapper';
import { handleError } from '@libs/utils/handle-error.util';
import { CategorySelectOptionResponseDto } from './dto/category-select-option-response.dto';
import { LogActivityService } from '@modules/admin/system/log-activity/log-activity.service';
import { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@Injectable()
export class CategoryService extends BasePaginationCrudService<
  CategoryEntity,
  CategoryResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'code',
    'nameEn',
    'nameKh',
    'createdById',
  ];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh', 'createdById'];
  protected SEARCHABLE_COLUMNS = ['code', 'nameEn', 'nameKh'];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly logActivityService: LogActivityService,
  ) {
    super();
  }

  protected get repository(): Repository<CategoryEntity> {
    return this.categoryRepository;
  }

  protected getMapperReponseEntityField(
    entity: CategoryEntity,
  ): Promise<CategoryResponseDto> {
    return Promise.resolve(CategoryMapper.toDto(entity));
  }

  public async create(
    dto: CreateCategoryRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<CategoryResponseDto> {
    try {
      const entity = CategoryMapper.toCreateEntity(dto);
      const savedEntity = await this.categoryRepository.save(entity);
      await this.logActivityService.record({
        userId: dto.createdById,
        ...logMeta,
        module: 'category',
        action: 'create',
        description: `create Category ${savedEntity.code}`,
      });
      return CategoryMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<CategoryResponseDto> {
    try {
      const entity = await this.categoryRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Category not found');
      }

      return CategoryMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<
    CategorySelectOptionResponseDto[]
  > {
    try {
      const entities = await this.categoryRepository.find({
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

      return entities.map((entity) => CategoryMapper.toSelectOptionDto(entity));
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateCategoryRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<CategoryResponseDto> {
    try {
      const entity = await this.categoryRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Category not found');
      }

      const updatedEntity = CategoryMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.categoryRepository.save(updatedEntity);
      await this.logActivityService.record({
        ...logMeta,
        module: 'category',
        action: 'update',
        description: `update Category ${savedEntity.code}`,
      });
      return CategoryMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number, logMeta?: LogActivityMeta): Promise<void> {
    try {
      const entity = await this.categoryRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Category not found');
      }

      await this.categoryRepository.softRemove(entity);
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? entity.createdById,
        module: 'category',
        action: 'delete',
        description: `delete Category ${entity.code}`,
      });
    } catch (error) {
      handleError(error);
    }
  }
}
