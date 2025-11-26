export type PaginationType<T> = {
    records: T[],
    total: number,
    page: number,
    pages: number,
    data?: any
};


export function getDefaultPaginated<T>(records: T[] = []): PaginationType<T> {
    return {
        records: Array.isArray(records) ? records : [],
        total: 0,
        page: 1,
        pages: 0,
        data: {}
    };
}