import { lessons } from "./lessons.js";

var webstore = new Vue({
  el: "#app",
  data: {
    siteName: "After School Lesson",
    showProducts: true,
    products: lessons,
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
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
  },
});
