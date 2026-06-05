import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { PermissionGroupSelectOptionResponseDto } from './dto/permission-group-select-option-response.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permission')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/permission',
  version: '1',
})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('select-options')
  @ApiResponse({
    status: 200,
    type: [PermissionGroupSelectOptionResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public findAllForSelection(): Promise<
    PermissionGroupSelectOptionResponseDto[]
  > {
    return this.permissionService.findAllForSelection();
  }
}
