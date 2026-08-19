export interface IPaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
