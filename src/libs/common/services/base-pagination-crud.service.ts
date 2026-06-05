import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from 'nestjs-paginate';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginatedResponse } from '../paginations/paginated-response.type';
import { handleError } from '@libs/utils/handle-error.util';

export abstract class BasePaginationCrudService<T extends ObjectLiteral, K> {
  protected abstract repository: Repository<T>;

  protected SORTABLE_COLUMNS: string[] = [];
  protected FILTER_COLUMNS: string[] = [];
  protected SEARCHABLE_COLUMNS: string[] = [];
  protected RELATIONSIP_FIELDS: string[] = [];

  protected buildFilterableColumns(): Record<string, FilterOperator[]> {
    return this.FILTER_COLUMNS.reduce(
      (acc, column) => {
        acc[column] = [FilterOperator.EQ];
        return acc;
      },
      {} as Record<string, FilterOperator[]>,
    );
  }

  protected abstract getMapperReponseEntityField(entities: T): Promise<K>;

  public async list(query: PaginateQuery): Promise<PaginatedResponse<T, K>> {
    try {
      const result = await paginate(query, this.repository, {
        sortableColumns: this.SORTABLE_COLUMNS as any,
        searchableColumns: this.SEARCHABLE_COLUMNS as any,
        defaultLimit: 10,
        defaultSortBy: [['id', 'DESC']] as PaginateConfig<T>['defaultSortBy'],
        filterableColumns: this.buildFilterableColumns() as any,
        relations: this.RELATIONSIP_FIELDS as any,
      });
      const mappedData = await Promise.all(
        result.data.map((item) => this.getMapperReponseEntityField(item)),
      );

      return {
        ...result,
        data: mappedData,
      };
    } catch (error) {
      handleError(error);
    }
  }
}
