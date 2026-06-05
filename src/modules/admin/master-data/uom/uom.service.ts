import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUomRequestDto } from './dto/create-uom-request.dto';
import { UpdateUomRequestDto } from './dto/update-uom-request.dto';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { UomEntity } from './entities/uom.entity';
import { UomResponseDto } from './dto/uom-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UomMapper } from './uom.mapper';
import { handleError } from '@libs/utils/handle-error.util';

@Injectable()
export class UomService extends BasePaginationCrudService<
  UomEntity,
  UomResponseDto
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
    @InjectRepository(UomEntity)
    private readonly uomRepository: Repository<UomEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<UomEntity> {
    return this.uomRepository;
  }

  protected getMapperReponseEntityField(
    entity: UomEntity,
  ): Promise<UomResponseDto> {
    return Promise.resolve(UomMapper.toDto(entity));
  }

  public async create(dto: CreateUomRequestDto): Promise<UomResponseDto> {
    try {
      const entity = UomMapper.toCreateEntity(dto);
      const savedEntity = await this.uomRepository.save(entity);
      return UomMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<UomResponseDto> {
    try {
      const entity = await this.uomRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('UOM not found');
      }
      return UomMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateUomRequestDto,
  ): Promise<UomResponseDto> {
    try {
      const entity = await this.uomRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('UOM not found');
      }

      const updatedEntity = UomMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.uomRepository.save(updatedEntity);
      return UomMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      const entity = await this.uomRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('UOM not found');
      }
      await this.uomRepository.softRemove(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
