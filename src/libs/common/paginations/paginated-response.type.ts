import { Paginated } from 'nestjs-paginate';

export type PaginatedResponse<T, K> =
  Omit<Paginated<T>, 'data'> & {
    data: K[];
  };
