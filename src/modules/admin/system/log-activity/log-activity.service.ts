import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { handleError } from '@libs/utils/handle-error.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogActivityRequestDto } from './dto/create-log-activity-request.dto';
import { LogActivityResponseDto } from './dto/log-activity-response.dto';
import { LogActivityEntity } from './entities/log-activity.entity';
import { LogActivityMapper } from './log-activity.mapper';

@Injectable()
export class LogActivityService extends BasePaginationCrudService<
  LogActivityEntity,
  LogActivityResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'userId',
    'module',
    'action',
    'ipAddress',
    'createdAt',
  ];
  protected FILTER_COLUMNS = ['userId', 'module', 'action', 'ipAddress'];
  protected SEARCHABLE_COLUMNS = [
    'module',
    'action',
    'description',
    'ipAddress',
    'userAgent',
  ];
  protected RELATIONSIP_FIELDS = ['user'];

  constructor(
    @InjectRepository(LogActivityEntity)
    private readonly logActivityRepository: Repository<LogActivityEntity>,
  ) {
    super();
  }

  protected get repository(): Repository<LogActivityEntity> {
    return this.logActivityRepository;
  }

  protected getMapperReponseEntityField(
    entity: LogActivityEntity,
  ): Promise<LogActivityResponseDto> {
    return LogActivityMapper.toDto(entity);
  }

  public async create(
    dto: CreateLogActivityRequestDto,
  ): Promise<LogActivityResponseDto> {
    try {
      const entity = LogActivityMapper.toCreateEntity(dto);
      const savedEntity = await this.logActivityRepository.save(entity);

      return LogActivityMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<LogActivityResponseDto> {
    try {
      const entity = await this.logActivityRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
        },
      });
      if (!entity) {
        throw new NotFoundException('Log activity not found');
      }

      return LogActivityMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }
}
