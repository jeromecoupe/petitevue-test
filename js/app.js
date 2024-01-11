// import petite vue
import { createApp } from "https://unpkg.com/petite-vue?module";

/**
 * Debounce generic function
 * https://dev.to/yanagisawahidetoshi/boost-your-javascript-performance-with-the-debounce-technique-497i
 *
 * @param {*} callback
 * @param {*} delay
 * @returns debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

createApp({
  products: [],
  nbrResults: 0,
  searchQuery: "",
  loading: true,
  sizes: [],
  debouncedSearchQuery: debounce(function (event) {
    this.searchQuery = event.target.value;
  }, 200),

  // initial load
  async fetchProducts() {
    const data = await fetch("./api/products.json");
    const jsonData = await data.json();
    this.products = jsonData.data;
    this.loading = false;
  },

  // get filtered Products
  get filteredProducts() {
    // get products to filter
    let data = this.products;

    // handle search
    if (this.searchQuery.length) {
      data = data.filter((product) => {
        let productName = product.name.toLowerCase();
        let q = this.searchQuery.toLowerCase();
        return productName.includes(q);
      });
    }

    // handle sizes
    if (this.sizes.length) {
      data = data.filter((product) => {
        return this.sizes.some((size) => {
          return product.sizes.includes(size);
        });
      });
    }

    // number of results after filters
    this.nbrResults = data.length;

    // send data back
    return data;
  },
}).mount("#app");
