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
    customerName: "",
    customerPhone: "",
    searchQuery: "",
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
    // method to get lessons by id stored in the cart array
    getCartProducts() {
      return this.cart.map((cartItemId) => {
        return this.products.find((product) => product.id === cartItemId);
      });
    },
    // delete a lesson from the cart
    removeFromCart(productId) {
      const index = this.cart.indexOf(productId);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    },
    // checkout method
    checkout() {
      alert(
        `Checking out for ${this.customerName}. You will receive updates on ${this.customerPhone}`
      );

      // Go back to display lessons after checking out
      this.showProducts = true;
    },
    // method to set the sorting criteria
    setSortCriteria(criteria) {
      this.sortCriteria = criteria;
    },
    // method to toggle sorting order between 'asc' and 'desc'
    toggleSortOrder(order) {
      this.sortOrder = order;
    },
    // search function
    searchedResults(lessons) {
      // check if the search query is not empty first
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();

        // convert texts to lowercase before checking if the search query matches subject or location
        return lessons.filter(
          (product) =>
            product.subject.toLowerCase().includes(query) ||
            product.location.toLowerCase().includes(query)
        );
      }
      return lessons;
    },
  },
  computed: {
    sortedLessons() {
      const criteria = this.sortCriteria;
      const order = this.sortOrder === "asc" ? 1 : -1;

      let lessons = this.products.slice(); // create a copy of the array

      // if search input has text, filter matched results for the search query
      if (this.searchQuery.trim()) {
        lessons = this.searchedResults(lessons);
      }

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
    // method to check if the checkout form is valid
    isCheckoutFormValid() {
      const nameRegex = /^[a-zA-Z\s]*$/; // regex for letters only
      const phoneRegex = /^[0-9]*$/; // regex for numbers only

      // if name or phone is empty then return false
      if (
        this.customerName.trim().length === 0 ||
        this.customerPhone.trim().length === 0
      ) {
        return false;
      }

      // return true if both name and phone number regex matches, false otherwise
      return (
        nameRegex.test(this.customerName) && phoneRegex.test(this.customerPhone)
      );
    },
  },
});
