const lessons = [
  {
    id: 1001,
    title: "Math",
    location: "London",
    description: "",
    price: 100,
    availableInventory: 5,
    image: "assets/images/product-fullsize.png",
  },
  {
    id: 1002,
    title: "English",
    location: "York",
    description: "",
    price: 80,
    availableInventory: 5,
    image: "assets/images/product-fullsize.png",
  },
  {
    id: 1003,
    title: "Music",
    location: "Bristol",
    description: "",
    price: 90,
    availableInventory: 5,
    image: "assets/images/product-fullsize.png",
  },
];

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
      return product.availableInventory > this.cartCount(product.id);
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
