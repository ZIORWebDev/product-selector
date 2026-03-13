import apiFetch from "@wordpress/api-fetch"
import type { ProductInformation } from "./types"

type FetchProductInformationResponse = {
	product?: ProductInformation
}

declare const ZIORWPBlocks: {
	restUrl: string
	products?: Record<string, ProductInformation>
}

const buildQuery = (productId: unknown) => {
	const params = new URLSearchParams()

	params.set("productId", String(productId ?? ""))

	return `products/information?${params.toString()}`
}

export async function defaultFetchProductInformation(
	productId: string
): Promise<ProductInformation | null> {
	const normalizedProductId = String(productId ?? "").trim()

	if (!normalizedProductId) {
		return null
	}

	ZIORWPBlocks.products = ZIORWPBlocks.products || {}

	const cached = ZIORWPBlocks.products[normalizedProductId]
	if (cached) {
		return cached
	}

	const query = buildQuery(normalizedProductId)

	const results = await apiFetch<FetchProductInformationResponse>({
		path: `/${ZIORWPBlocks.restUrl}/${query}`,
	})

	const product = results?.product ?? null

	if (product) {
		ZIORWPBlocks.products[normalizedProductId] = product
	}

	return product
}