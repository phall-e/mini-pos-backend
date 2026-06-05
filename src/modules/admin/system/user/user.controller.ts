import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { ResetUserPasswordRequestDto } from './dto/reset-user-password-request.dto';
import { VerifyResetUserPasswordRequestDto } from './dto/verify-reset-user-password-request.dto';
import { UserActionResponseDto } from './dto/user-action-response.dto';

@ApiTags('User')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions('user-create')
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.userService.create(dto);
  }

  @Get()
  @Permissions('user-read')
  @ApiPaginatedResponse(UserResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<UserEntity, UserResponseDto>> {
    return this.userService.list(query);
  }

  @Get('select-options')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              username: { type: 'string' },
            },
          },
        },
      },
    },
  })
  // @Permissions('user-read')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAllForSelection(): Promise<{ id: number; username: string }[]> {
    return this.userService.findAllForSelection();
  }

  @Get(':id')
  // @Permissions('user-read')
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @Permissions('user-edit')
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('user-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }

  @Post(':id/reset-password')
  @Permissions('user-edit')
  @ApiResponse({ status: 200, type: UserActionResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public resetPassword(
    @Param('id') id: string,
    @Body() dto: ResetUserPasswordRequestDto,
  ): Promise<UserActionResponseDto> {
    return this.userService.resetPassword(+id, dto);
  }

  @Post(':id/reset-password/verify-otp')
  @Permissions('user-edit')
  @ApiResponse({ status: 200, type: UserActionResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public verifyResetPassword(
    @Param('id') id: string,
    @Body() dto: VerifyResetUserPasswordRequestDto,
  ): Promise<UserActionResponseDto> {
    return this.userService.verifyResetPassword(+id, dto);
  }
}
