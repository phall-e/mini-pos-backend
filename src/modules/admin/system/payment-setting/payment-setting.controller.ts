import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { CreatePaymentSettingRequestDto } from './dto/create-payment-setting-request.dto';
import { GenerateQrCodeResponseDto } from './dto/generate-qr-code-response.dto';
import { PaymentSettingSelectOptionResponseDto } from './dto/payment-setting-select-option-response.dto';
import { PaymentSettingResponseDto } from './dto/payment-setting-response.dto';
import { UpdatePaymentSettingRequestDto } from './dto/update-payment-setting-request.dto';
import { PaymentSettingEntity } from './entities/payment-setting.entity';
import { PaymentSettingService } from './payment-setting.service';
import { SkipAuth } from '@modules/auth/decorators/skip-auth.decorator';

@ApiTags('Payment Setting')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/payment-setting',
  version: '1',
})
export class PaymentSettingController {
  constructor(private readonly paymentSettingService: PaymentSettingService) {}

  @Post()
  @Permissions('payment-setting-create')
  @ApiResponse({ status: 201, type: PaymentSettingResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreatePaymentSettingRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<PaymentSettingResponseDto> {
    return this.paymentSettingService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('payment-setting-read')
  @ApiPaginatedResponse(PaymentSettingResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedResponse<PaymentSettingEntity, PaymentSettingResponseDto>
  > {
    return this.paymentSettingService.list(query);
  }

  @Get('generate-khr')
  // @Permissions('sale-create')
  @SkipAuth()
  @ApiResponse({ status: 200, type: GenerateQrCodeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  public generateKhrString(): Promise<GenerateQrCodeResponseDto> {
    return this.paymentSettingService.generateQrCode();
  }

  @Get('select-options')
  @Permissions('sale-create')
  @ApiResponse({ status: 200, type: [PaymentSettingSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAllForSelection(): Promise<
    PaymentSettingSelectOptionResponseDto[]
  > {
    return this.paymentSettingService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('payment-setting-read')
  @ApiResponse({ status: 200, type: PaymentSettingResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<PaymentSettingResponseDto> {
    return this.paymentSettingService.findOne(+id);
  }

  @Put(':id')
  @Permissions('payment-setting-edit')
  @ApiResponse({ status: 200, type: PaymentSettingResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentSettingRequestDto,
  ): Promise<PaymentSettingResponseDto> {
    return this.paymentSettingService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('payment-setting-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string): Promise<void> {
    return this.paymentSettingService.remove(+id);
  }
}
