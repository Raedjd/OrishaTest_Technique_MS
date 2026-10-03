export interface ApiPaginationParams {
    PageNumber?: number;
    PageSize?: number;
    Search?: string;
    SortBy?: string;
    SortOrder?: 'asc' | 'desc';
}

// Format de ItemPagedResult<T> côté API
export interface ApiResponse<T> {
    Items: T[];
    TotalCount: number;
    PageNumber: number;
    PageSize: number;
}

export interface ConfigFilters {
    PageNumber?: number;
    PageSize?: number;
    SortBy?: string;
    SortOrder?: 'asc' | 'desc';
    Search?: string;
}

// Format des erreurs renvoyées par l'API (400 / 404)
export interface ApiError {
    message?: string;
    errors?: string[];
}
