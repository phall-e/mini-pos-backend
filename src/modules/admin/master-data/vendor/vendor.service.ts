import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorRequestDto } from './dto/create-vendor-request.dto';
import { UpdateVendorRequestDto } from './dto/update-vendor-request.dto';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { VendorEntity } from './entities/vendor.entity';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorMapper } from './vendor.mapper';
import { handleError } from '@libs/utils/handle-error.util';
import { VendorSelectOptionResponseDto } from './dto/vendor-select-option-response.dto';
import { LogActivityService } from '@modules/admin/system/log-activity/log-activity.service';
import { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@Injectable()
export class VendorService extends BasePaginationCrudService<
  VendorEntity,
  VendorResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'code',
    'nameEn',
    'nameKh',
    'phoneNumber',
    'email',
    'createdById',
  ];
  protected FILTER_COLUMNS = ['code', 'nameEn', 'nameKh', 'createdById'];
  protected SEARCHABLE_COLUMNS = [
    'code',
    'nameEn',
    'nameKh',
    'phoneNumber',
    'email',
    'address',
  ];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
    private readonly logActivityService: LogActivityService,
  ) {
    super();
  }

  protected get repository(): Repository<VendorEntity> {
    return this.vendorRepository;
  }

  protected getMapperReponseEntityField(
    entity: VendorEntity,
  ): Promise<VendorResponseDto> {
    return Promise.resolve(VendorMapper.toDto(entity));
  }

  public async create(
    dto: CreateVendorRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<VendorResponseDto> {
    try {
      const entity = VendorMapper.toCreateEntity(dto);
      const savedEntity = await this.vendorRepository.save(entity);
      await this.logActivityService.record({
        userId: dto.createdById,
        ...logMeta,
        module: 'vendor',
        action: 'create',
        description: `create Vendor ${savedEntity.code}`,
      });
      return VendorMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<VendorResponseDto> {
    try {
      const entity = await this.vendorRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Vendor not found');
      }

      return VendorMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateVendorRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<VendorResponseDto> {
    try {
      const entity = await this.vendorRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Vendor not found');
      }

      const updatedEntity = VendorMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.vendorRepository.save(updatedEntity);
      await this.logActivityService.record({
        ...logMeta,
        module: 'vendor',
        action: 'update',
        description: `update Vendor ${savedEntity.code}`,
      });
      return VendorMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number, logMeta?: LogActivityMeta): Promise<void> {
    try {
      const entity = await this.vendorRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Vendor not found');
      }

      await this.vendorRepository.softRemove(entity);
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? entity.createdById,
        module: 'vendor',
        action: 'delete',
        description: `delete Vendor ${entity.code}`,
      });
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<VendorSelectOptionResponseDto[]> {
    try {
      const entities = await this.vendorRepository.find({
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

      return entities.map((entity) => VendorMapper.toSelectOptionDto(entity));
    } catch (error) {
      handleError(error);
    }
  }
}
