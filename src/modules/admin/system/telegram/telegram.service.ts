import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { TelegramEntity } from './entities/telegram.entity';
import { TelegramResponseDto } from './dto/telegram-repsonse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramMapper } from './telegram.mapper';
import { CreateTelegramRequestDto } from './dto/create-telegram-request.dto';
import { handleError } from '@libs/utils/handle-error.util';
import { UpdateTelegramRequestDto } from './dto/update-telegram-request.dto';
import { LogActivityService } from '@modules/admin/system/log-activity/log-activity.service';
import { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@Injectable()
export class TelegramService extends BasePaginationCrudService<
  TelegramEntity,
  TelegramResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'name',
    'telegramChatId',
    'slug',
    'isActive',
    'createdById',
  ];
  protected FILTER_COLUMNS = ['name', 'isActive', 'createdById'];
  protected SEARCHABLE_COLUMNS = ['name', 'telegramChatId', 'slug'];
  protected RELATIONSIP_FIELDS = ['createdBy'];

  constructor(
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,
    private readonly logActivityService: LogActivityService,
  ) {
    super();
  }

  protected get repository(): Repository<TelegramEntity> {
    return this.telegramRepository;
  }

  protected getMapperReponseEntityField(
    entity: TelegramEntity,
  ): Promise<TelegramResponseDto> {
    return Promise.resolve(TelegramMapper.toDto(entity));
  }

  public async create(
    dto: CreateTelegramRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<TelegramResponseDto> {
    try {
      const entity = TelegramMapper.toCreateEntity(dto);
      const savedEntity = await this.telegramRepository.save(entity);
      await this.logActivityService.record({
        userId: dto.createdById,
        ...logMeta,
        module: 'telegram',
        action: 'create',
        description: `create Telegram ${savedEntity.name}`,
      });
      return TelegramMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<TelegramResponseDto> {
    try {
      const entity = await this.telegramRepository.findOne({
        where: {
          id,
        },
        relations: {
          createdBy: true,
        },
      });
      if (!entity) {
        throw new NotFoundException('Telegram not found');
      }

      return TelegramMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async update(
    id: number,
    dto: UpdateTelegramRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<TelegramResponseDto> {
    try {
      const entity = await this.telegramRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Telegram not found');
      }

      const updatedEntity = TelegramMapper.toUpdateEntity(entity, dto);
      const savedEntity = await this.telegramRepository.save(updatedEntity);
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? savedEntity.createdById,
        module: 'telegram',
        action: 'update',
        description: `update Telegram ${savedEntity.name}`,
      });
      return TelegramMapper.toDto(savedEntity);
    } catch (error) {
      handleError(error);
    }
  }

  public async remove(id: number, logMeta?: LogActivityMeta): Promise<void> {
    try {
      const entity = await this.telegramRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('Telegram not found');
      }

      await this.telegramRepository.softRemove(entity);
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? entity.createdById,
        module: 'telegram',
        action: 'delete',
        description: `delete Telegram ${entity.name}`,
      });
    } catch (error) {
      handleError(error);
    }
  }

  public async sendMessage(chatId: string, message: string) {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
    } catch (error) {
      throw error;
    }
  }
}
