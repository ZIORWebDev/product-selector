import type { FC } from "react"
import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "@wordpress/element"
import { ComboboxControl } from "@wordpress/components"
import { __ } from "@wordpress/i18n"

import type {
	ProductAttr,
	ProductSelectorProps,
	ProductsListResponse,
} from "./types"

import { debounce } from "./utils/debounce"
import { defaultFetchProductOptions } from "./defaultFetchers"

type ComboboxOption = { label: string; value: string }

const EMPTY_PRODUCT: ProductAttr = { id: "", label: "" }

const ProductSelector: FC<ProductSelectorProps> = ({
	value,
	onChange = () => {},
	fetchOptions = defaultFetchProductOptions,
}) => {
	const [product, setProduct] = useState<ProductAttr>(value ?? EMPTY_PRODUCT)
	const [options, setOptions] = useState<ComboboxOption[]>([])
	const [searchTerm, setSearchTerm] = useState("")

	const reqSeqRef = useRef(0)
	const controlWrapRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		setProduct(value ?? EMPTY_PRODUCT)
	}, [value?.id, value?.label])

	const blurCombobox = useCallback(() => {
		const input = controlWrapRef.current?.querySelector("input")
		input?.blur()
	}, [])

	const loadOptions = useMemo(() => {
		return debounce(async (search: unknown, productId: unknown) => {
			const seq = ++reqSeqRef.current

			try {
				const results: ProductsListResponse =
					await fetchOptions(search, productId)

				if (seq !== reqSeqRef.current) return

				const products = results?.products ?? []

				setOptions(
					products.map((p) => ({
						label: p.name,
						value: String(p.id),
					}))
				)
			} catch {
				if (seq !== reqSeqRef.current) return
				setOptions([])
			}
		}, 300)
	}, [fetchOptions])

	useEffect(() => {
		loadOptions(searchTerm, product.id)
	}, [searchTerm, product.id, loadOptions])

	const displayedOptions = useMemo(() => {
		const productId = product?.id ? String(product.id) : ""

		if (!productId) return options

		if (options.some((o) => o.value === productId)) return options

		const label = product?.label?.trim() || `#${productId}`

		return [{ label, value: productId }, ...options]
	}, [options, product.id, product.label])

	return (
		<div className="components-base-control" ref={controlWrapRef}>
			<ComboboxControl
				label={__("Product")}
				value={product.id}
				options={displayedOptions}
				onChange={(val) => {
					const id = String(val ?? "")
					const selected = displayedOptions.find((o) => o.value === id)

					const newProduct: ProductAttr = {
						id,
						label: selected?.label || "",
					}

					setProduct(newProduct)
					onChange(newProduct)

					requestAnimationFrame(() => blurCombobox())
				}}
				onFilterValueChange={(val) => setSearchTerm(String(val))}
				placeholder={__("Type to search products...")}
			/>

			<p className="components-base-control__help">
				{__("Only choose products safe for public display.")}
			</p>
		</div>
	)
}

export default ProductSelector