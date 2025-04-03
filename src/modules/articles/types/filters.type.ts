export interface IArticleFilterParams {
    name?: string;
    description?: string;
    createdDateFrom?: string;
    createdDateTo?: string;
    updatedDateFrom?: string;
    updatedDateTo?: string;
    author?: string;
}

export interface IArticleSortParams {
    orderByName: 'ASC' | 'DESC';
    orderByCreatedDate: 'ASC' | 'DESC';
    orderByUpdatedDate: 'ASC' | 'DESC';
}

export interface IPaginationParams {
    page: number;
    limit: number;
}