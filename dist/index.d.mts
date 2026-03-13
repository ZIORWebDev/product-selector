import { FC } from 'react';

type ProductAttr = {
    id: string;
    label: string;
};
type ProductApiProduct = {
    id: string | number;
    name: string;
};
type ProductsListResponse = {
    products?: ProductApiProduct[];
};
type FetchProductOptions = (search: unknown, productId: unknown) => Promise<ProductsListResponse>;
interface ProductSelectorProps {
    value?: ProductAttr | null;
    onChange?: (value: ProductAttr) => void;
    /**
     * Custom fetcher
     */
    fetchOptions?: FetchProductOptions;
}

declare const ProductSelector: FC<ProductSelectorProps>;

declare function defaultFetchProductOptions(search: unknown, productId: unknown): Promise<ProductsListResponse>;

export { type FetchProductOptions, type ProductAttr, ProductSelector, type ProductSelectorProps, type ProductsListResponse, defaultFetchProductOptions };
