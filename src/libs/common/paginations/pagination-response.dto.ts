import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaDto {
    @ApiProperty()
    itemsPerPage: number;

    @ApiProperty()
    totalItems?: number;

    @ApiProperty()
    currentPage?: number;

    @ApiProperty()
    totalPages?: number; 
}

export class PaginationResponseDto<T> {
    @ApiProperty()
    data: T[];
    
    @ApiProperty()
    meta: PaginationMetaDto;

    @ApiProperty()
    links?: Record<string, string>;
}