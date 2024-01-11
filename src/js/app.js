import { createApp } from "petite-vue";

// fonctionne pas
function debounce1(callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

// fonctionne
function debounce2(fn, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

createApp({
  products: [],
  nbrResults: 0,
  searchQuery: "",
  loading: true,
  sizes: [],
  debouncedSearchQuery: debounce1(function (event) {
    this.searchQuery = event.target.value;
  }, 200),

  // initial load
  async fetchProducts() {
    const data = await fetch("../api/products.json");
    const jsonData = await data.json();
    this.products = jsonData.data;
    this.loading = false;
  },

  // get filtered Products
  get filteredProducts() {
    // get products to filter
    let data = this.products;

    // handle search
    if (this.searchQuery.length > 0) {
      data = data.filter((product) => {
        let productName = product.name.toLowerCase();
        let q = this.searchQuery.toLowerCase();
        return productName.includes(q);
      });
    }

    // handle size
    if (this.sizes.length > 0) {
      data = data.filter((product) => {
        return this.sizes.some((size) => {
          return product.sizes.includes(size);
        });
      });
    }

    this.nbrResults = data.length;

    return data;
  },
}).mount("#app");
