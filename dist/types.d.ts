export type ProductAttr = {
    id: string;
    label: string;
};
export type ProductOption = {
    id: string | number;
    name: string;
};
export type ProductsListResponse = {
    products?: ProductOption[];
};
export type ProductInformation = {
    id: number | string;
    name?: string;
    slug?: string;
    permalink?: string;
    status?: string;
    type?: string;
    price?: string;
    regular_price?: string;
    sale_price?: string;
    on_sale?: boolean;
    price_html?: string;
    description?: string;
    average_rating?: string;
    review_count?: number;
    rating_count?: number;
    rating_html?: string;
};
export type FetchProductOptions = (search: unknown, productId: unknown) => Promise<ProductsListResponse>;
export type FetchProductInformation = (productId: string) => Promise<ProductInformation | null>;
export type ProductSelectorProps = {
    value?: ProductAttr;
    onChange?: (product: ProductAttr) => void;
    onProductInformationChange?: (productInformation: ProductInformation | null, product: ProductAttr) => void;
    onProductInformationError?: (error: unknown, product: ProductAttr) => void;
    fetchOptions?: FetchProductOptions;
    fetchProductInformation?: FetchProductInformation;
};
//# sourceMappingURL=types.d.ts.map