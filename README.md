# Product Selector Component

A reusable **React Product Selector component** designed for **WordPress / Gutenberg environments**.  
It provides a searchable dropdown for selecting WooCommerce products and supports **custom fetchers**, allowing it to work with any API.

This package is lightweight, flexible, and easy to integrate into **Gutenberg blocks or React applications**.

---

## Features

- Searchable product dropdown
- Debounced API requests
- Custom product fetcher support
- Built for WordPress / Gutenberg React environments
- Distributed as an npm package
- Supports preselected product values

---

## Installation

```bash
npm install @your-org/product-selector
```

or

```bash
yarn add @your-org/product-selector
```

---

## Basic Usage

```tsx
import { ProductSelector } from '@your-org/product-selector';

function MyComponent() {
  const handleChange = (product) => {
    console.log(product);
  };

  return (
    <ProductSelector
      value={{ id: '123', label: 'Sample Product' }}
      onChange={handleChange}
    />
  );
}
```

---

## Props

| Prop | Type | Description |
|-----|-----|-------------|
| `value` | `{ id: string; label: string }` | Currently selected product |
| `onChange` | `(product) => void` | Callback when a product is selected |
| `fetcher` | `(search, productId) => Promise` | Optional custom product fetch function |

---

## Using a Custom Fetcher

You can provide your own fetch logic if you are not using the default API.

Example:

```tsx
import { ProductSelector } from '@your-org/product-selector';

const fetchProducts = async (search, productId) => {
  const res = await fetch(`/api/products?search=${search}`);
  const data = await res.json();

  return {
    products: data.products.map((p) => ({
      id: p.id,
      label: p.name,
    })),
  };
};

function MyComponent() {
  return <ProductSelector fetcher={fetchProducts} />;
}
```

---

## Expected Fetcher Response Format

The custom fetcher must return data in the following format:

```ts
{
  products: [
    {
      id: string | number;
      label: string;
    }
  ]
}
```

---

## Example with WordPress API

Example using `@wordpress/api-fetch`:

```ts
import apiFetch from '@wordpress/api-fetch';

export async function fetchProductOptions(search, productId) {
  const response = await apiFetch({
    path: `/wp-json/my-plugin/products?search=${search}&productId=${productId}`
  });

  return {
    products: response.products.map((p) => ({
      id: p.id,
      label: p.name
    }))
  };
}
```

---

## Development

Install dependencies:

```bash
npm install
```

Run development mode:

```bash
npm run dev
```

Build the package:

```bash
npm run build
```

---

## Publishing

The package can be published to **npm**.

Manual publish:

```bash
npm publish
```

If using GitHub Actions, the package can also be automatically published when changes are pushed to the `main` branch.

---

## License

MIT