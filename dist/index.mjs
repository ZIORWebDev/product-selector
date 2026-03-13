// src/ProductSelector.tsx
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from "@wordpress/element";
import { ComboboxControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

// src/utils/debounce.ts
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// src/defaultFetchers.ts
import apiFetch from "@wordpress/api-fetch";
var hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};
var buildQuery = (search, productId) => {
  const params = new URLSearchParams();
  params.set("search", String(search != null ? search : "").trim().toLowerCase());
  params.set("productId", String(productId != null ? productId : ""));
  return `products/lists?${params.toString()}`;
};
async function defaultFetchProductOptions(search, productId) {
  const query = buildQuery(search, productId);
  const key = hashString(query);
  ZIORWPBlocks.queries = ZIORWPBlocks.queries || {};
  const cached = ZIORWPBlocks.queries[key];
  if (cached) return cached;
  const results = await apiFetch({
    path: `/${ZIORWPBlocks.restUrl}/${query}`
  });
  ZIORWPBlocks.queries[key] = results;
  return results;
}

// src/ProductSelector.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var EMPTY_PRODUCT = { id: "", label: "" };
var ProductSelector = ({
  value,
  onChange = () => {
  },
  fetchOptions = defaultFetchProductOptions
}) => {
  const [product, setProduct] = useState(value != null ? value : EMPTY_PRODUCT);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const reqSeqRef = useRef(0);
  const controlWrapRef = useRef(null);
  useEffect(() => {
    setProduct(value != null ? value : EMPTY_PRODUCT);
  }, [value == null ? void 0 : value.id, value == null ? void 0 : value.label]);
  const blurCombobox = useCallback(() => {
    var _a;
    const input = (_a = controlWrapRef.current) == null ? void 0 : _a.querySelector("input");
    input == null ? void 0 : input.blur();
  }, []);
  const loadOptions = useMemo(() => {
    return debounce(async (search, productId) => {
      var _a;
      const seq = ++reqSeqRef.current;
      try {
        const results = await fetchOptions(search, productId);
        if (seq !== reqSeqRef.current) return;
        const products = (_a = results == null ? void 0 : results.products) != null ? _a : [];
        setOptions(
          products.map((p) => ({
            label: p.name,
            value: String(p.id)
          }))
        );
      } catch {
        if (seq !== reqSeqRef.current) return;
        setOptions([]);
      }
    }, 300);
  }, [fetchOptions]);
  useEffect(() => {
    loadOptions(searchTerm, product.id);
  }, [searchTerm, product.id, loadOptions]);
  const displayedOptions = useMemo(() => {
    var _a;
    const productId = (product == null ? void 0 : product.id) ? String(product.id) : "";
    if (!productId) return options;
    if (options.some((o) => o.value === productId)) return options;
    const label = ((_a = product == null ? void 0 : product.label) == null ? void 0 : _a.trim()) || `#${productId}`;
    return [{ label, value: productId }, ...options];
  }, [options, product.id, product.label]);
  return /* @__PURE__ */ jsxs("div", { className: "components-base-control", ref: controlWrapRef, children: [
    /* @__PURE__ */ jsx(
      ComboboxControl,
      {
        label: __("Product"),
        value: product.id,
        options: displayedOptions,
        onChange: (val) => {
          const id = String(val != null ? val : "");
          const selected = displayedOptions.find((o) => o.value === id);
          const newProduct = {
            id,
            label: (selected == null ? void 0 : selected.label) || ""
          };
          setProduct(newProduct);
          onChange(newProduct);
          requestAnimationFrame(() => blurCombobox());
        },
        onFilterValueChange: (val) => setSearchTerm(String(val)),
        placeholder: __("Type to search products...")
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "components-base-control__help", children: __("Only choose products safe for public display.") })
  ] });
};
var ProductSelector_default = ProductSelector;
export {
  ProductSelector_default as ProductSelector,
  defaultFetchProductOptions
};
