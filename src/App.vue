<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-light bg-light">
        <div class="container">
          <div class="left mr-auto">
            <span class="navbar-brand mb-0 h1" v-text="siteName"></span>
          </div>
          <div class="right">
            <button
              v-on:click="showCheckout"
              :disabled="!cartItemCount > 0 && showProducts"
              class="btn btn-dark"
            >
              {{ cartItemCount }}
              <span class="fas fa-cart-plus"></span>
              Cart
            </button>
          </div>
        </div>
      </nav>
    </header>

    <div class="container">
      <main class="my-5">
        <LessonList
          v-if="showProducts"
          :products="products"
          :cart="cart"
          :searchQuery="searchQuery"
          :initialSortCriteria="sortCriteria"
          :initialSortOrder="sortOrder"
          @update:sortCriteria="sortCriteria = $event"
          @update:sortOrder="sortOrder = $event"
          @update:searchQuery="searchQuery = $event"
          @add-item-to-cart="addToCart"
        ></LessonList>

        <Checkout
          v-if="!showProducts"
          :products="products"
          :cart="cart"
          :cartCount="cartCount"
          @remove-item-from-cart="removeFromCart"
          @submit-order="checkout"
        ></Checkout>
      </main>
    </div>
  </div>
</template>

<script>
import LessonList from "./components/LessonList.vue";
import Checkout from "./components/Checkout.vue";

const backendUrl =
  "https://webapp-cw-kp-env.eba-srg7t2hn.eu-west-2.elasticbeanstalk.com";

export default {
  name: "App",
  components: {
    LessonList,
    Checkout,
  },
  data() {
    return {
      siteName: "After School Lesson",
      showProducts: true,
      products: [],
      cart: [],
      sortCriteria: "topic", // default sort criteria
      sortOrder: "asc", // default sort order
      searchQuery: "", // search query entered by the user
    };
  },
  mounted() {
    this.fetchLessons();
  },
  created() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/M00664409-webapp-cw/service-worker.js");
    }
  },
  watch: {
    searchQuery(newQuery) {
      this.performSearch();
    },
  },
  methods: {
    fetchLessons() {
      fetch(`${backendUrl}/lessons`)
        .then((res) => res.json())
        .then((data) => (this.products = data))
        .catch((err) =>
          console.error("There was an error fetching the lessons:", err)
        );
    },
    addToCart(product) {
      this.cart.push(product.id);
    },
    canAddToCart(product) {
      return product.space > this.cartCount(product.id);
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
    // delete a lesson from the cart
    removeFromCart(productId) {
      const index = this.cart.indexOf(productId);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    },
    // checkout method
    checkout(data) {
      // Prepare order data to send to the backend
      const orderData = {
        name: data.name,
        phone: data.phone,
        lessonIds: this.cart,
        space: this.cart.length,
      };

      // Send order data to "order" collection
      fetch(`${backendUrl}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          this.completeCheckout(orderData);
        })
        .catch((err) => console.error("Error sending order data:", err));
    },
    // update space after checkout and cleanup/refresh data
    completeCheckout(orderData) {
      alert(
        `Checking out for ${orderData.name}. You will receive updates on ${orderData.phone}`
      );

      const updatePromises = this.cart.map((productId) => {
        const product = this.products.find((p) => p.id === productId);

        // Check if the product exists and has space available before updating
        if (product && product.space > 0) {
          return fetch(`${backendUrl}/lessons/${product._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ space: product.space - 1 }), // reduce space by 1
          });
        }
      });

      Promise.all(updatePromises)
        .then(() => {
          // Fetch the updated lessons data
          this.fetchLessons();
        })
        .catch((err) => console.error("Error updating lessons:", err));

      // Clear the cart and reset checkout form
      this.cart = [];

      // Go back to display lessons after checking out
      this.showProducts = true;
    },
    performSearch() {
      fetch(`${backendUrl}/search?q=${this.searchQuery}`)
        .then((res) => res.json())
        .then((data) => {
          this.products = data;
        })
        .catch((err) => console.error("Error fetching search results:", err));
    },
    setSortCriteria(criteria) {
      this.sortCriteria = criteria;
    },
    // method to toggle sorting order between 'asc' and 'desc'
    toggleSortOrder(order) {
      this.sortOrder = order;
    },
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
  },
};
</script>
