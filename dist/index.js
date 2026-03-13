"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ProductSelector: () => ProductSelector_default,
  defaultFetchProductOptions: () => defaultFetchProductOptions
});
module.exports = __toCommonJS(index_exports);

// src/ProductSelector.tsx
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");

// src/utils/debounce.ts
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// src/defaultFetchers.ts
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
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
  const results = await (0, import_api_fetch.default)({
    path: `/${ZIORWPBlocks.restUrl}/${query}`
  });
  ZIORWPBlocks.queries[key] = results;
  return results;
}

// src/ProductSelector.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_PRODUCT = { id: "", label: "" };
var ProductSelector = ({
  value,
  onChange = () => {
  },
  fetchOptions = defaultFetchProductOptions
}) => {
  const [product, setProduct] = (0, import_element.useState)(value != null ? value : EMPTY_PRODUCT);
  const [options, setOptions] = (0, import_element.useState)([]);
  const [searchTerm, setSearchTerm] = (0, import_element.useState)("");
  const reqSeqRef = (0, import_element.useRef)(0);
  const controlWrapRef = (0, import_element.useRef)(null);
  (0, import_element.useEffect)(() => {
    setProduct(value != null ? value : EMPTY_PRODUCT);
  }, [value == null ? void 0 : value.id, value == null ? void 0 : value.label]);
  const blurCombobox = (0, import_element.useCallback)(() => {
    var _a;
    const input = (_a = controlWrapRef.current) == null ? void 0 : _a.querySelector("input");
    input == null ? void 0 : input.blur();
  }, []);
  const loadOptions = (0, import_element.useMemo)(() => {
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
  (0, import_element.useEffect)(() => {
    loadOptions(searchTerm, product.id);
  }, [searchTerm, product.id, loadOptions]);
  const displayedOptions = (0, import_element.useMemo)(() => {
    var _a;
    const productId = (product == null ? void 0 : product.id) ? String(product.id) : "";
    if (!productId) return options;
    if (options.some((o) => o.value === productId)) return options;
    const label = ((_a = product == null ? void 0 : product.label) == null ? void 0 : _a.trim()) || `#${productId}`;
    return [{ label, value: productId }, ...options];
  }, [options, product.id, product.label]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "components-base-control", ref: controlWrapRef, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.ComboboxControl,
      {
        label: (0, import_i18n.__)("Product"),
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
        placeholder: (0, import_i18n.__)("Type to search products...")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "components-base-control__help", children: (0, import_i18n.__)("Only choose products safe for public display.") })
  ] });
};
var ProductSelector_default = ProductSelector;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProductSelector,
  defaultFetchProductOptions
});
