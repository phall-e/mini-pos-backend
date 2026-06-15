import { ApiPaginatedResponse } from '@libs/common/paginations/api-paginated-response.decorator';
import { PaginatedResponse } from '@libs/common/paginations/paginated-response.type';
import { Permissions } from '@modules/auth/decorators/permissions.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { SWAGGER_TOKEN_NAME } from 'src/swagger/config';
import { LogActivityResponseDto } from './dto/log-activity-response.dto';
import { LogActivityEntity } from './entities/log-activity.entity';
import { LogActivityService } from './log-activity.service';

@ApiTags('Log Activity')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller({
  path: 'admin/system/log-activities',
  version: '1',
})
export class LogActivityController {
  constructor(private readonly logActivityService: LogActivityService) {}

  @Get()
  @Permissions('log-activity-read')
  @ApiPaginatedResponse(LogActivityResponseDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedResponse<LogActivityEntity, LogActivityResponseDto>> {
    return this.logActivityService.list(query);
  }

  @Get(':id')
  @Permissions('log-activity-read')
  @ApiResponse({ status: 200, type: LogActivityResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public findOne(@Param('id') id: string): Promise<LogActivityResponseDto> {
    return this.logActivityService.findOne(+id);
  }
}
