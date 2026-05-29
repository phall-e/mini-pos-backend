import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiUnauthorizedResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginationResponseDto } from "./pagination-response.dto";
import { ResponseDto } from "../dtos/response.dto";

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiQuery({
            name: 'search',
            type: String,
            required: false,
            example: '',
        }),
        ApiQuery({
            name: 'limit',
            type: Number,
            required: false,
            example: 10,
        }),
        ApiQuery({
            name: 'page',
            type: Number,
            required: false,
            example: 1,
        }),
        ApiQuery({
            name: 'sortBy',
            required: false,
            example: 'ASC',
            schema: {
                type: 'string',
                enum: ['ASC', 'DESC'],
            },
        }),
        ApiExtraModels(ResponseDto, PaginationResponseDto, model),
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ResponseDto) },
                    {
                        properties: {
                            payload: {
                                allOf: [
                                    { $ref: getSchemaPath(PaginationResponseDto) },
                                    {
                                        properties: {
                                            data: {
                                                type: 'array',
                                                items: { $ref: getSchemaPath(model) },
                                            }
                                        }
                                    }
                                ]
                            },
                            timestamp: {
                                type: 'number',
                            }
                        }
                    }
                ]
            }
        }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiForbiddenResponse({ description: 'Forbidden' }),
        ApiNotFoundResponse({ description: 'Not found' }),
        ApiInternalServerErrorResponse({ description: 'Server error' }),
    );
}