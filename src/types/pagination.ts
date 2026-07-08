export interface Pagination {
    actual_page: number
    total_pages: number
    actual_count: number
    total_count: number
    has_next_page: boolean
    has_previous_page: boolean
}

export interface PaginatedResponse<T> {
    docs: T[]
    pagination: Pagination
}
