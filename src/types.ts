export type ProductAttr = {
	id: string
	label: string
}

export type ProductApiProduct = {
	id: string | number
	name: string
}

export type ProductsListResponse = {
	products?: ProductApiProduct[]
}

export type FetchProductOptions = (
	search: unknown,
	productId: unknown
) => Promise<ProductsListResponse>

export interface ProductSelectorProps {
	value?: ProductAttr | null
	onChange?: (value: ProductAttr) => void

	/**
	 * Custom fetcher
	 */
	fetchOptions?: FetchProductOptions
}