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
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { CustomerService } from './customer.service';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CustomerSelectOptionResponseDto } from './dto/customer-select-option-response.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
import { CustomerEntity } from './entities/customer.entity';

@ApiTags('Customer')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/customers',
  version: '1',
})
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Permissions('customer-create')
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateCustomerRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CustomerResponseDto> {
    return this.customerService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('customer-read')
  @ApiPaginatedResponse(CustomerResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<CustomerEntity, CustomerResponseDto>> {
    return this.customerService.list(query);
  }

  @Get('select-options')
  @Permissions('customer-read')
  @ApiResponse({ status: 200, type: [CustomerSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAllForSelection(): Promise<CustomerSelectOptionResponseDto[]> {
    return this.customerService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('customer-read')
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
    return this.customerService.findOne(+id);
  }

  @Put(':id')
  @Permissions('customer-edit')
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('customer-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string): Promise<void> {
    return this.customerService.remove(+id);
  }
}
