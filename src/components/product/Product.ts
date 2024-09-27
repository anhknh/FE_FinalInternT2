interface Product {
    id: number;
    productCode: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    urlImage: string | null;
    status: string;
    category: string[];
    categoryId: string,
    createdDate: string;
    modifiedDate: string;
    createdBy: string;
    modifiedBy: string;
    categoryCode?: string[]
}

interface ProductResponse {
    content: Product[];
    totalElements: number;
}

export {Product, ProductResponse};