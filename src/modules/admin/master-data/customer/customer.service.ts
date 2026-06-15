import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { Repository } from 'typeorm';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerSelectOptionResponseDto } from './dto/customer-select-option-response.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerMapper } from './customer.mapper';
import { LogActivityService } from '@modules/admin/system/log-activity/log-activity.service';
import { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@Injectable()
export class CustomerService extends BasePaginationCrudService<
  CustomerEntity,
  CustomerResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'code',
    'nameEn',
    'nameKh',
    'gender',
    'dob',
    'phoneNumber',
    'createdById',
  ];
  protected FILTER_COLUMNS = ['code', 'gender', 'createdById'];
  protected SEARCHABLE_COLUMNS = [
    'code',
    'nameEn',
    'nameKh',
    'phoneNumber',
    'address',
    'note',
  ];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private readonly logActivityService: LogActivityService,
  ) {
    super();
  }

  protected get repository(): Repository<CustomerEntity> {
    return this.customerRepository;
  }

  protected getMapperReponseEntityField(
    entity: CustomerEntity,
  ): Promise<CustomerResponseDto> {
    return Promise.resolve(CustomerMapper.toDto(entity));
  }

  public async create(
    dto: CreateCustomerRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<CustomerResponseDto> {
    try {
      const entity = CustomerMapper.toCreateEntity(dto);
      const savedEntity = await this.customerRepository.save(entity);
      await this.logActivityService.record({
        userId: dto.createdById,
        ...logMeta,
        module: 'customer',
        action: 'create',
        description: `create Customer ${savedEntity.code}`,
      });
      return CustomerMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<CustomerResponseDto> {
    try {
      const entity = await this.customerRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Customer not found');
      }

      return CustomerMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateCustomerRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<CustomerResponseDto> {
    try {
      const entity = await this.customerRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Customer not found');
      }

      const updatedEntity = CustomerMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.customerRepository.save(updatedEntity);
      await this.logActivityService.record({
        ...logMeta,
        module: 'customer',
        action: 'update',
        description: `update Customer ${savedEntity.code}`,
      });
      return CustomerMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number, logMeta?: LogActivityMeta): Promise<void> {
    try {
      const entity = await this.customerRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Customer not found');
      }

      await this.customerRepository.softRemove(entity);
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? entity.createdById,
        module: 'customer',
        action: 'delete',
        description: `delete Customer ${entity.code}`,
      });
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<
    CustomerSelectOptionResponseDto[]
  > {
    try {
      const entities = await this.customerRepository.find({
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameKh: true,
          gender: true,
        },
        order: {
          nameEn: 'ASC',
        },
      });

      return entities.map((entity) => CustomerMapper.toSelectOptionDto(entity));
    } catch (error) {
      handleError(error);
    }
  }
}
