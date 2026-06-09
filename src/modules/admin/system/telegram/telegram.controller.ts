import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { TelegramService } from './telegram.service';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { TelegramResponseDto } from './dto/telegram-repsonse.dto';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { CreateTelegramRequestDto } from './dto/create-telegram-request.dto';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { TelegramEntity } from './entities/telegram.entity';
import { UpdateTelegramRequestDto } from './dto/update-telegram-request.dto';

@ApiTags('Telegram')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/telegrams',
  version: '1',
})
export class TelegramController {

    constructor(private readonly telegramService: TelegramService) {}

    @Post()
    @Permissions('telegram-create')
    @ApiResponse({ status: 201, type: TelegramResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    public create(
        @Body() dto: CreateTelegramRequestDto,
    @CurrentUser() user: UserEntity,
    ): Promise<TelegramResponseDto> {
        return this.telegramService.create({
            ...dto,
            createdById: user.id,
        });
    }

    @Get()
    @Permissions('telegram-read')
    @ApiPaginatedResponse(TelegramResponseDto)
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    public findAll(
        @Paginate() query: PaginateQuery,
    ): Promise<
        PaginatedResponse<TelegramEntity, TelegramResponseDto>
    > {
        return this.telegramService.list(query);
    }

    @Get(':id')
    @Permissions('telegram-read')
    @ApiResponse({ status: 200, type: TelegramResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    public findOne(@Param('id') id: string): Promise<TelegramResponseDto> {
    return this.telegramService.findOne(+id);
    }

    @Put(':id')
    @Permissions('telegram-edit')
    @ApiResponse({ status: 200, type: TelegramResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    public update(
        @Param('id') id: string,
        @Body() dto: UpdateTelegramRequestDto,
    ): Promise<TelegramResponseDto> {
        return this.telegramService.update(+id, dto);
    }

    @Delete(':id')
    @Permissions('telegram-delete')
    @ApiResponse({ status: 200 })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    public remove(@Param('id') id: string): Promise<void> {
        return this.telegramService.remove(+id);
    }
}
