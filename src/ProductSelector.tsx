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
	ProductInformation,
} from "./types"

import { debounce } from "./utils/debounce"
import {
	defaultFetchProductOptions,
	defaultFetchProductInformation,
} from "./"

type ComboboxOption = { label: string; value: string }

const EMPTY_PRODUCT: ProductAttr = { id: "", label: "" }

const ProductSelector: FC<ProductSelectorProps> = ({
	value,
	onChange = () => {},
	onProductInformationChange = () => {},
	onProductInformationError = () => {},
	fetchOptions = defaultFetchProductOptions,
	fetchProductInformation = defaultFetchProductInformation,
}) => {
	const [product, setProduct] = useState<ProductAttr>(value ?? EMPTY_PRODUCT)
	const [options, setOptions] = useState<ComboboxOption[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [isFetchingProductInformation, setIsFetchingProductInformation] =
		useState(false)

	const reqSeqRef = useRef(0)
	const productInfoReqSeqRef = useRef(0)
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

	const handleProductInformationFetch = useCallback(
		async (selectedProduct: ProductAttr) => {
			const id = String(selectedProduct?.id ?? "")

			if (!id) {
				onProductInformationChange(null, selectedProduct)
				return
			}

			const seq = ++productInfoReqSeqRef.current
			setIsFetchingProductInformation(true)

			try {
				const productInformation: ProductInformation | null =
					await fetchProductInformation(id)

				if (seq !== productInfoReqSeqRef.current) return

				onProductInformationChange(productInformation, selectedProduct)
			} catch (error) {
				if (seq !== productInfoReqSeqRef.current) return

				onProductInformationError(error, selectedProduct)
			} finally {
				if (seq === productInfoReqSeqRef.current) {
					setIsFetchingProductInformation(false)
				}
			}
		},
		[
			fetchProductInformation,
			onProductInformationChange,
			onProductInformationError,
		]
	)

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
					void handleProductInformationFetch(newProduct)

					requestAnimationFrame(() => blurCombobox())
				}}
				onFilterValueChange={(val) => setSearchTerm(String(val))}
				placeholder={__("Type to search products...")}
			/>

			<p className="components-base-control__help">
				{isFetchingProductInformation
					? __("Loading product information...")
					: __("Only choose products safe for public display.")}
			</p>
		</div>
	)
}

export default ProductSelector