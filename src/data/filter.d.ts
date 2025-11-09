type SearchFilters = {
    page?: number,
    limit: number,
    keyword: string,
    order_column: number,
    order_dir: 'asc' | 'desc',
    tag?: string,
    type: number
}