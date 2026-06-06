import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorRequestDto } from './dto/create-vendor-request.dto';
import { UpdateVendorRequestDto } from './dto/update-vendor-request.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { VendorEntity } from './entities/vendor.entity';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { VendorSelectOptionResponseDto } from './dto/vendor-select-option-response.dto';

@ApiTags('Vendor')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/master-data/vendors',
  version: '1',
})
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @Permissions('vendor-create')
  @ApiResponse({ status: 201, type: VendorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(
    @Body() dto: CreateVendorRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<VendorResponseDto> {
    return this.vendorService.create({
      ...dto,
      createdById: user.id,
    });
  }

  @Get()
  @Permissions('vendor-read')
  @ApiPaginatedResponse(VendorResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<VendorEntity, VendorResponseDto>> {
    return this.vendorService.list(query);
  }

  @Get('select-options')
  @Permissions('vendor-read')
  @ApiResponse({ status: 200, type: [VendorSelectOptionResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAllForSelection(): Promise<VendorSelectOptionResponseDto[]> {
    return this.vendorService.findAllForSelection();
  }

  @Get(':id')
  @Permissions('vendor-read')
  @ApiResponse({ status: 200, type: VendorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<VendorResponseDto> {
    return this.vendorService.findOne(+id);
  }

  @Put(':id')
  @Permissions('vendor-edit')
  @ApiResponse({ status: 200, type: VendorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorRequestDto,
  ): Promise<VendorResponseDto> {
    return this.vendorService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('vendor-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string): Promise<void> {
    return this.vendorService.remove(+id);
  }
}
