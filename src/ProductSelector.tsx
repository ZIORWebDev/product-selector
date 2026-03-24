import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
	memo,
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
const noop = () => {}

const ProductSelector = ({
	value,
	onChange = noop,
	onProductInformationChange = noop,
	onProductInformationError = noop,
	fetchOptions = defaultFetchProductOptions,
	fetchProductInformation = defaultFetchProductInformation,
}: ProductSelectorProps) => {
	const selectedProduct = value ?? EMPTY_PRODUCT
	const productId = String(selectedProduct?.id ?? "")
	const productLabel = String(selectedProduct?.label ?? "")

	const [options, setOptions] = useState<ComboboxOption[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [isFetchingProductInformation, setIsFetchingProductInformation] =
		useState(false)

	const reqSeqRef = useRef(0)
	const productInfoReqSeqRef = useRef(0)
	const lastFetchedProductIdRef = useRef("")
	const controlWrapRef = useRef<HTMLDivElement | null>(null)

	const blurCombobox = useCallback(() => {
		const input = controlWrapRef.current?.querySelector("input")
		input?.blur()
	}, [])

	const loadOptions = useMemo(() => {
		return debounce(async (search: unknown, currentProductId: unknown) => {
			const seq = ++reqSeqRef.current

			try {
				const results: ProductsListResponse = await fetchOptions(
					search,
					currentProductId
				)

				if (seq !== reqSeqRef.current) {
					return
				}

				const products = results?.products ?? []

				setOptions(
					products.map((p) => ({
						label: p.name,
						value: String(p.id),
					}))
				)
			} catch {
				if (seq !== reqSeqRef.current) {
					return
				}

				setOptions([])
			}
		}, 300)
	}, [fetchOptions])

	useEffect(() => {
		loadOptions(searchTerm, productId)

		return () => {
			loadOptions.cancel?.()
		}
	}, [searchTerm, loadOptions])

	const displayedOptions = useMemo(() => {
		if (!productId) {
			return options
		}

		if (options.some((option) => option.value === productId)) {
			return options
		}

		const fallbackLabel = productLabel.trim() || `#${productId}`

		return [{ label: fallbackLabel, value: productId }, ...options]
	}, [options, productId, productLabel])

	const handleProductInformationFetch = useCallback(
		async (id: string, product: ProductAttr) => {
			if (!id) {
				onProductInformationChange(null, product)
				return
			}

			const seq = ++productInfoReqSeqRef.current
			setIsFetchingProductInformation(true)

			try {
				const productInformation: ProductInformation | null =
					await fetchProductInformation(id)

				if (seq !== productInfoReqSeqRef.current) {
					return
				}

				onProductInformationChange(productInformation, product)
			} catch (error) {
				if (seq !== productInfoReqSeqRef.current) {
					return
				}

				onProductInformationError(error, product)
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

	useEffect(() => {
		const currentProduct: ProductAttr = {
			id: productId,
			label: productLabel,
		}

		if (!productId) {
			lastFetchedProductIdRef.current = ""
			onProductInformationChange(null, currentProduct)
			return
		}

		if (lastFetchedProductIdRef.current === productId) {
			return
		}

		lastFetchedProductIdRef.current = productId
		void handleProductInformationFetch(productId, currentProduct)
	}, [
		productId,
		productLabel,
		handleProductInformationFetch,
		onProductInformationChange,
	])

	return (
		<div className="components-base-control" ref={controlWrapRef}>
			<ComboboxControl
				label={__("Product")}
				value={productId}
				options={displayedOptions}
				onChange={(val) => {
					const id = String(val ?? "")
					const selected = displayedOptions.find((option) => option.value === id)

					onChange({
						id,
						label: selected?.label ?? "",
					})

					requestAnimationFrame(() => {
						blurCombobox()
					})
				}}
				onFilterValueChange={(val) => {
					setSearchTerm(String(val ?? ""))
				}}
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

export default memo(ProductSelector)