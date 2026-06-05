import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleResponseDto } from './dto/role-response.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { RoleEntity } from './entities/role.entity';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';

@ApiTags('Role')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/role',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions('role-create')
  @ApiResponse({ status: 201, type: RoleResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public create(@Body() dto: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return this.roleService.create(dto);
  }

  @Get()
  @Permissions('role-read')
  @ApiPaginatedResponse(RoleResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<RoleEntity, RoleResponseDto>> {
    return this.roleService.list(query);
  }

  @Get(':id')
  @Permissions('role-read')
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    return this.roleService.findOne(+id);
  }

  @Put(':id')
  @Permissions('role-edit')
  @ApiResponse({ status: 200, type: RoleResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleRequestDto,
  ): Promise<RoleResponseDto> {
    return this.roleService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('role-delete')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(+id);
  }
}
