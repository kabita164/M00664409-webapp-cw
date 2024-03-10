<script setup></script>

<template>
  <div class="cart-and-checkout">
    <!-- Shopping cart section -->
    <div class="cart-section">
      <h2 class="mb-4">Shopping Cart</h2>
      <div class="products">
        <div
          v-for="(product, index) in cartProducts"
          :key="`${product.id}-${index}`"
          class="cart-item product"
        >
          <div class="product-details">
            <div>
              <p>Subject: {{ product.topic }}</p>
              <p>Location: {{ product.location }}</p>
              <p>Price: £{{ product.price }}</p>
              <p>Space: {{ product.space - cartCount(product.id) }}</p>
            </div>
            <div class="icon">
              <span :class="product.icon"></span>
            </div>
          </div>
          <div>
            <button
              v-on:click="removeFromCart(product.id)"
              class="btn btn-danger"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-5" />

    <!-- Checkout form -->
    <div class="checkout-section">
      <h2 class="mb-4">Checkout</h2>
      <div class="mb-3">
        <label for="customerName" class="form-label">Name:</label>
        <input
          type="text"
          class="form-control"
          id="customerName"
          v-model="customerName"
        />
      </div>

      <div class="mb-3">
        <label for="customerPhone" class="form-label">Phone Number:</label>
        <input
          type="text"
          class="form-control"
          id="customerPhone"
          v-model="customerPhone"
        />
      </div>

      <button
        v-on:click="submitOrder"
        class="btn btn-primary"
        :disabled="!isCheckoutFormValid"
      >
        Checkout
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Checkout",
  props: ["products", "cart", "cartCount"],
  data() {
    return {
      customerName: "",
      customerPhone: "",
    };
  },
  methods: {
    removeFromCart(productId) {
      this.$emit("remove-item-from-cart", productId);
    },
    submitOrder() {
      // Validate form input or handle order submission here
      // For simplicity, this example just emits an event with the order details
      this.$emit("submit-order", {
        name: this.customerName,
        phone: this.customerPhone,
        products: this.cart,
      });
      // Reset form
      this.customerName = "";
      this.customerPhone = "";
    },
  },
  computed: {
    cartProducts() {
      return this.cart.map((cartItemId) =>
        this.products.find((product) => product.id === cartItemId)
      );
    },
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
};
</script>
