const backendUrl =
  "http://webapp-cw-backend-k164.eu-west-2.elasticbeanstalk.com";

var webstore = new Vue({
  el: "#app",
  data: {
    siteName: "After School Lesson",
    showProducts: true,
    products: [],
    sortCriteria: "topic", // default sort criteria
    sortOrder: "asc", // default sort order
    cart: [],
    customerName: "",
    customerPhone: "",
    searchQuery: "",
  },
  mounted() {
    // fetch lessons when application starts
    this.fetchLessons();
  },
  created() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }
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
      // Prepare order data to send to the backend
      const orderData = {
        name: this.customerName,
        phone: this.customerPhone,
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
          this.completeCheckout();
        })
        .catch((err) => console.error("Error sending order data:", err));
    },
    // update space after checkout and cleanup/refresh data
    completeCheckout() {
      alert(
        `Checking out for ${this.customerName}. You will receive updates on ${this.customerPhone}`
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
      this.customerName = "";
      this.customerPhone = "";

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
    performSearch() {
      fetch(`${backendUrl}/search?q=${this.searchQuery}`)
        .then((res) => res.json())
        .then((data) => {
          this.products = data;
        })
        .catch((err) => console.error("Error fetching search results:", err));
    },
  },
  computed: {
    sortedLessons() {
      const criteria = this.sortCriteria;
      const order = this.sortOrder === "asc" ? 1 : -1;

      let lessons = this.products.slice(); // create a copy of the array

      return lessons.sort((a, b) => {
        // If sorting by remaining space, compare by (space - cartCount)
        if (this.sortCriteria === "space") {
          const remainingSpaceA = a.space - this.cartCount(a.id);
          const remainingSpaceB = b.space - this.cartCount(b.id);

          return (remainingSpaceA - remainingSpaceB) * order;
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
    // check if search query has no results
    showNoResultsMessage() {
      return (
        this.searchQuery.trim().length !== 0 && this.sortedLessons.length === 0
      );
    },
  },
});
