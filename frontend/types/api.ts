// types/api.ts
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

