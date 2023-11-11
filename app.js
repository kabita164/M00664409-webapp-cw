import { lessons } from "./lessons.js";

var webstore = new Vue({
  el: "#app",
  data: {
    siteName: "After School Lesson",
    showProducts: true,
    products: lessons,
    sortCriteria: "subject", // default sort criteria
    sortOrder: "asc", // default sort order
    cart: [],
  },
  methods: {
    addToCart(product) {
      this.cart.push(product.id);
    },
    canAddToCart(product) {
      return product.spaces > this.cartCount(product.id);
    },
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },
    showCheckout() {
      this.showProducts = this.showProducts ? false : true;
    },
    // method to set the sorting criteria
    setSortCriteria(criteria) {
      this.sortCriteria = criteria;
    },
    // method to toggle sorting order between 'asc' and 'desc'
    toggleSortOrder(order) {
      this.sortOrder = order;
    },
  },
  computed: {
    sortedLessons() {
      const criteria = this.sortCriteria;
      const order = this.sortOrder === "asc" ? 1 : -1;

      let lessons = this.products.slice(); // create a copy of the array

      return lessons.sort((a, b) => {
        // If sorting by remaining spaces, compare by (spaces - cartCount)
        if (this.sortCriteria === "spaces") {
          const remainingSpacesA = a.spaces - this.cartCount(a.id);
          const remainingSpacesB = b.spaces - this.cartCount(b.id);

          return (remainingSpacesA - remainingSpacesB) * order;
        }

        // For oher sorting criteria
        if (a[criteria] < b[criteria]) return -order;
        if (a[criteria] > b[criteria]) return order;
        return 0;
      });
    },
    cartItemCount: function () {
      return this.cart.length || "";
    },
  },
});
