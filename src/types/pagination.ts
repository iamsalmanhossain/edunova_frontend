/**
 * Standardized Pagination & Data Table Interfaces for Edunova Portal.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  semester?: number;
  departmentId?: string;
  shift?: "FIRST_SHIFT" | "SECOND_SHIFT";
}
