# Product Selector

Reusable **React product selector component** for WordPress projects (Gutenberg blocks, plugins, or admin interfaces).

This package provides a searchable **WooCommerce product selector** built on top of `ComboboxControl`, with optional support for fetching product information such as price, title, or metadata.

It is designed to be **framework-agnostic but optimized for WordPress environments**.

---

# Installation

```bash
npm install @ziorweb-dev/product-selector
```

or

```bash
yarn add @ziorweb-dev/product-selector
```

---

# Features

* Search WooCommerce products
* Async REST API loading
* Debounced search
* Custom fetchers supported
* Emits product information
* Error handling support
* Small bundle size
* Gutenberg compatible
* TypeScript support

---

# Basic Usage

```tsx
import { ProductSelector } from '@ziorweb-dev/product-selector';

const EMPTY_PRODUCT = { id: '', label: '' };

<ProductSelector
	value={product ?? EMPTY_PRODUCT}
	onChange={(nextProduct) => {
		setProduct(nextProduct);
	}}
/>
```

---

# Getting Product Information

The selector can automatically fetch product information and notify the consumer.

Example for updating a block with a product price.

```tsx
<ProductSelector
	value={product ?? { id: '', label: '' }}

	onChange={(product) => {
		setAttributes({ product });
	}}

	onProductInformationChange={(info) => {
		setAttributes({
			content: info?.price_html ?? '',
		});
	}}
/>
```

Example product information response:

```ts
{
	id: 123,
	name: "Product Name",
	price_html: "<span class='woocommerce-Price-amount'>$29.00</span>"
}
```

If the product is cleared or the request fails, the callback may receive:

```ts
null
```

---

# Error Handling

You can handle API failures using `onProductInformationError`.

```tsx
<ProductSelector
	value={product}

	onProductInformationError={(error) => {
		console.error('Product fetch failed', error);
	}}
/>
```

This is triggered when the product information request fails.

---

# Custom Fetchers

The component allows overriding the default fetch logic.

## Custom product search

```tsx
<ProductSelector
	value={product}

	fetchOptions={async (search) => {
		const res = await fetch(`/api/products?search=${search}`);
		return res.json();
	}}
/>
```

Expected response format:

```ts
{
	products: [
		{ id: 1, name: "Product A" },
		{ id: 2, name: "Product B" }
	]
}
```

---

## Custom product information fetch

```tsx
<ProductSelector
	value={product}

	fetchProductInformation={async (productId) => {
		const res = await fetch(`/api/products/${productId}`);
		return res.json();
	}}
/>
```

Expected response:

```ts
{
	id: 1,
	name: "Product A",
	price_html: "<span>$29</span>"
}
```

---

# Gutenberg Example

Example inside a block `Edit` component.

```tsx
<ProductSelector
	value={attributes.product}

	onChange={(product) => {
		setAttributes({ product });
	}}

	onProductInformationChange={(info) => {
		setAttributes({
			content: info?.price_html ?? '',
		});
	}}

	onProductInformationError={() => {
		setAttributes({ content: '' });
	}}
/>
```

---

# Types

## ProductValue

```ts
type ProductValue = {
	id: string
	label: string
}
```

---

## ProductInformation

```ts
type ProductInformation = {
	id?: string | number
	name?: string
	price_html?: string
	[key: string]: unknown
}
```

---

# Component API

## ProductSelector Props

| Prop                         | Type                | Description                                         |
| ---------------------------- | ------------------- | --------------------------------------------------- |
| `value`                      | `ProductValue`      | Currently selected product                          |
| `onChange`                   | `(product) => void` | Triggered when product changes                      |
| `onProductInformationChange` | `(info) => void`    | Triggered when product information is loaded        |
| `onProductInformationError`  | `(error) => void`   | Triggered when product information fetch fails      |
| `fetchOptions`               | `function`          | Custom function for fetching product search results |
| `fetchProductInformation`    | `function`          | Custom function for fetching product details        |

---

# Default WordPress Behavior

By default the component expects a REST API endpoint similar to:

```
/wp-json/your-namespace/products/lists
```

Example response:

```json
{
  "products": [
    { "id": 123, "name": "Example Product" }
  ]
}
```