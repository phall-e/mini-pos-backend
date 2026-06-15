import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { BasePaginationCrudService } from '@libs/common/services/base-pagination-crud.service';
import { PasswordHash } from '@libs/utils/password-hash.util';
import { handleError } from '@libs/utils/handle-error.util';
import { TelegramService } from '@modules/admin/system/telegram/telegram.service';
import { generateOpt } from '@libs/utils/otp-generator.util';
import { ResetUserPasswordRequestDto } from './dto/reset-user-password-request.dto';
import { VerifyResetUserPasswordRequestDto } from './dto/verify-reset-user-password-request.dto';
import { UserActionResponseDto } from './dto/user-action-response.dto';
import { LogActivityService } from '@modules/admin/system/log-activity/log-activity.service';
import { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';

@Injectable()
export class UserService extends BasePaginationCrudService<
  UserEntity,
  UserResponseDto
> {
  protected SORTABLE_COLUMNS = [
    'id',
    'username',
    'isAdmin',
    'isActive',
    'isRequiredOtp',
  ];
  protected FILTER_COLUMNS = [
    'username',
    'isAdmin',
    'isActive',
    'isRequiredOtp',
  ];
  protected SEARCHABLE_COLUMNS = [
    'username',
    'isAdmin',
    'isActive',
    'isRequiredOtp',
  ];
  protected RELATIONSIP_FIELDS = ['roles'];

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly telegramService: TelegramService,
    private readonly logActivityService: LogActivityService,
  ) {
    super();
  }

  protected get repository(): Repository<UserEntity> {
    return this.userRepository;
  }

  protected getMapperReponseEntityField(
    entities: UserEntity,
  ): Promise<UserResponseDto> {
    return UserMapper.toDtoWithRelationship(entities);
  }

  public async create(
    dto: CreateUserRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<UserResponseDto> {
    try {
      let entity = UserMapper.toCreateEntity({
        ...dto,
        password: await PasswordHash.hash(dto.password),
        roles: [],
      });
      entity = await this.userRepository.save(entity);
      if (dto.roles?.length) {
        await this.userRepository
          .createQueryBuilder()
          .relation(UserEntity, 'roles')
          .of(entity.id) // or entity
          .add(dto.roles);
      }
      await this.logActivityService.record({
        ...logMeta,
        module: 'user',
        action: 'create',
        description: `create User ${entity.username}`,
      });
      return UserMapper.toDto(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findAllForSelection(): Promise<
    { id: number; username: string }[]
  > {
    try {
      const entity = await this.userRepository.find({
        select: {
          id: true,
          username: true,
        },
        where: {
          isActive: true,
        },
      });
      return entity;
    } catch (error) {
      handleError(error);
    }
  }

  public async findOne(id: number): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: {
          roles: true,
        },
      });
      if (!entity) {
        throw new NotFoundException('User not found');
      }

      return UserMapper.toDtoWithRelationship(entity);
    } catch (error) {
      handleError(error);
    }
  }

  public async findOneByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: [{ username: username }, { email: username }],
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
  }

  public async update(
    id: number,
    dto: UpdateUserRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<UserResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
        relations: {
          roles: true,
        },
      });
      if (!entity) {
        throw new NotFoundException('User not found');
      }

      const oldRoleIds = ((await entity.roles) ?? []).map((role) => role.id);

      const updatedEntity = UserMapper.toUpdateEntity(entity, dto);
      await this.userRepository.save(updatedEntity);

      if (dto.roles) {
        const newRoleIds = dto.roles;
        const roleIdsToAdd = newRoleIds.filter(
          (roleId) => !oldRoleIds.includes(roleId),
        );
        const roleIdsToRemove = oldRoleIds.filter(
          (roleId) => !newRoleIds.includes(roleId),
        );

        if (roleIdsToAdd.length || roleIdsToRemove.length) {
          await this.userRepository
            .createQueryBuilder()
            .relation(UserEntity, 'roles')
            .of(id)
            .addAndRemove(roleIdsToAdd, roleIdsToRemove);
        }
      }

      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? id,
        module: 'user',
        action: 'update',
        description: `update User ${updatedEntity.username}`,
      });
      return this.findOne(id);
    } catch (error) {
      handleError(error);
    }
  }

  public async updateOtp(userId: number, otp?: string): Promise<void> {
    const entity = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!entity) throw new NotFoundException();
    await this.userRepository.update(
      {
        id: userId,
      },
      {
        otpCode: otp,
      },
    );
  }

  public async remove(id: number, logMeta?: LogActivityMeta): Promise<void> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.softRemove(entity);
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? id,
        module: 'user',
        action: 'delete',
        description: `delete User ${entity.username}`,
      });
    } catch (error) {
      handleError(error);
    }
  }

  public async resetPassword(
    id: number,
    dto: ResetUserPasswordRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<UserActionResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('User not found');
      }
      if (!entity.telegramChatId) {
        throw new BadRequestException('Telegram chat id is required');
      }

      const isMatched = await PasswordHash.verify(
        dto.password,
        entity.password,
      );
      if (!isMatched) {
        throw new UnauthorizedException('Invalid password');
      }

      const otp = generateOpt();
      await this.updateOtp(entity.id, otp);
      await this.telegramService.sendMessage(
        entity.telegramChatId,
        `Your password reset OTP is ${otp}`,
      );
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? id,
        module: 'user',
        action: 'reset-password',
        description: `request password reset for User ${entity.username}`,
      });

      return {
        success: true,
        status: 200,
        message: 'OTP sent to Telegram',
      };
    } catch (error) {
      handleError(error);
    }
  }

  public async verifyResetPassword(
    id: number,
    dto: VerifyResetUserPasswordRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<UserActionResponseDto> {
    try {
      const entity = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!entity) {
        throw new NotFoundException('User not found');
      }
      if (!entity.otpCode || entity.otpCode !== dto.otp) {
        throw new UnauthorizedException('Invalid OTP code');
      }

      await this.userRepository.update(
        {
          id,
        },
        {
          password: await PasswordHash.hash(dto.newPassword),
          otpCode: null,
        },
      );
      await this.logActivityService.record({
        ...logMeta,
        userId: logMeta?.userId ?? id,
        module: 'user',
        action: 'verify-reset-password',
        description: `verify password reset for User ${entity.username}`,
      });

      return {
        success: true,
        status: 200,
        message: 'Password changed successfully',
      };
    } catch (error) {
      handleError(error);
    }
  }
}
