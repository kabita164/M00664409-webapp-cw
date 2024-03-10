<script setup></script>

<template>
  <div class="lesson-list">
    <div class="products-section row">
      <!-- Search input -->
      <div class="search-bar mb-4">
        <input
          type="text"
          class="form-control"
          v-model="localSearchQuery"
          @input="performSearch"
          placeholder="Search lessons..."
        />
      </div>

      <div class="row">
        <!-- Sort settings section -->
        <div class="col-3">
          <p>Sort by</p>
          <hr />
          <div class="sorting-criteria">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sortBy"
                id="topic"
                v-model="localSortCriteria"
                value="topic"
                @change="setSortCriteria('topic')"
                checked
              />
              <label class="form-check-label" for="topic"> Subject </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sortBy"
                id="location"
                v-model="localSortCriteria"
                value="location"
                @change="setSortCriteria('location')"
              />
              <label class="form-check-label" for="location"> Location </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sortBy"
                id="price"
                v-model="localSortCriteria"
                value="price"
                @change="setSortCriteria('price')"
              />
              <label class="form-check-label" for="price"> Price </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sortBy"
                id="space"
                v-model="localSortCriteria"
                value="space"
                @change="setSortCriteria('space')"
              />
              <label class="form-check-label" for="space"> Availability </label>
            </div>
          </div>

          <hr />

          <div class="sorting-order">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sortOrder"
                id="asc"
                v-model="localSortOrder"
                value="asc"
                @change="toggleSortOrder('asc')"
                checked
              />
              <label class="form-check-label" for="asc"> Ascending </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="sortOrder"
                id="desc"
                v-model="localSortOrder"
                value="desc"
                @change="toggleSortOrder('desc')"
              />
              <label class="form-check-label" for="desc"> Descending </label>
            </div>
          </div>
        </div>

        <!-- Display of lessons -->
        <div class="col-9 products">
          <div v-for="product in sortedLessons" class="product">
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
                v-on:click="addToCart(product)"
                :disabled="!canAddToCart(product)"
                class="btn btn-primary"
              >
                Add to cart
              </button>
              <span v-if="product.space === cartCount(product.id)">
                All out!
              </span>
            </div>
          </div>

          <div v-if="showNoResultsMessage">No results found!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonsList",
  props: [
    "products",
    "cart",
    "searchQuery",
    "initialSortCriteria",
    "initialSortOrder",
  ],
  data() {
    return {
      // Local data properties mirroring initial prop values
      localSortCriteria: this.initialSortCriteria,
      localSortOrder: this.initialSortOrder,
      localSearchQuery: this.searchQuery,
    };
  },
  methods: {
    addToCart(product) {
      // emit a custom event "add-item-to-cart" that triggers the Parent Component to add a lesson to cart
      this.$emit("add-item-to-cart", product);
    },
    canAddToCart(product) {
      return product.space > this.cartCount(product.id);
    },
    cartCount(id) {
      return this.cart.filter((cartId) => cartId === id).length;
    },
    performSearch() {
      console.log("perform search", this.localSearchQuery);
      this.$emit("update:searchQuery", this.localSearchQuery);
    },
    setSortCriteria(criteria) {
      this.localSortCriteria = criteria;
      this.$emit("update:sortCriteria", criteria); // Emit an event for the parent
    },
    toggleSortOrder(order) {
      this.localSortOrder = order;
      this.$emit("update:sortOrder", order); // Emit an event for the parent
    },
  },
  computed: {
    sortedLessons() {
      let lessons = [...this.products]; // Make a copy of the array
      const orderMultiplier = this.localSortOrder === "asc" ? 1 : -1;

      return lessons.sort((a, b) => {
        let comparison = 0;
        if (this.localSortCriteria === "space") {
          comparison =
            a.space - this.cartCount(a.id) - (b.space - this.cartCount(b.id));
        } else if (a[this.localSortCriteria] < b[this.localSortCriteria]) {
          comparison = -1;
        } else if (a[this.localSortCriteria] > b[this.localSortCriteria]) {
          comparison = 1;
        }
        return comparison * orderMultiplier;
      });
    },
    // check if search query has no results
    showNoResultsMessage() {
      return (
        this.searchQuery.trim().length !== 0 && this.sortedLessons.length === 0
      );
    },
  },
};
</script>
