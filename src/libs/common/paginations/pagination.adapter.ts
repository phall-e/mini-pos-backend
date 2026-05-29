import { PaginatedResponse } from "./paginated-response.type";
import { PaginationResponseDto } from "./pagination-response.dto";

export function toPaginationResponseDto<T, K>(
    result: PaginatedResponse<T, K>
): PaginationResponseDto<K> {
    return {
        data: result.data,
        meta: {
            itemsPerPage: result.meta.itemsPerPage,
            totalItems: result.meta.totalItems,
            currentPage: result.meta.currentPage,
            totalPages: result.meta.totalPages,
        },
        links: result.links,
    };
}