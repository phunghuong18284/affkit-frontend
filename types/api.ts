// =============================================================================
// types/api.ts
// =============================================================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  error: ApiError | null
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  isFirst: boolean
  isLast: boolean
}
