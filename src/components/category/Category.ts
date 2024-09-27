interface Category {
    id: number;
    categoryCode: string;
    name: string;
    description: string;
    urlImage: string | null;
    status: string;
    createdDate: string;
    modifiedDate: string;
    createdBy: string;
    modifiedBy: string;
}

interface CategoryResponse {
    content: Category[];
    totalElements: number;
}

export {Category, CategoryResponse};