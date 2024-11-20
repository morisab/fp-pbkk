<template>
  <div class="min-h-screen bg-back flex justify-center py-10">
    <div class="w-full max-w-6xl">
      <h1 class="text-4xl font-bold text-center mb-8 text-custom">Menu</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <p class="text-lg text-custom">Loading menu...</p>
      </div>

      <!-- Menu List -->
      <div
        v-if="!loading && menu.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4"
      >
        <div
          v-for="item in menu"
          :key="item.id"
          class="bg-description shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
        >
          <img
            :src="item.image_url"
            alt="menu item"
            class="w-full h-48 object-cover rounded-t-lg"
          />
          <div class="p-6 text-center">
            <h2 class="text-xl font-bold text-custom">
              {{ item.name }}
            </h2>
            <p class="text-description mb-2">
              {{ item.description }}
            </p>
            <p class="text-lg font-semibold text-description">
              Rp {{ item.price }}
            </p>
            <div class="flex justify-center items-center mt-4">
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                class="w-16 p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
                placeholder="Qty"
              />
              <button
                @click="addToCart(item)"
                class="ml-4 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Menu Available -->
      <div v-if="!loading && menu.length === 0" class="text-center">
        <p class="text-lg text-description">No menu available.</p>
      </div>

      <!-- Cart Section -->
      <div class="mt-8 px-4">
        <h2
          class="text-3xl font-bold text-center mb-6 text-custom"
          v-if="cart.length > 0"
        >
          Order
        </h2>
        <div
          v-if="cart.length > 0"
          class="bg-description shadow-lg rounded-lg p-6 space-y-4"
        >
          <div
            v-for="(cartItem, index) in cart"
            :key="cartItem.id"
            class="flex justify-between items-center border-b pb-4 last:border-b-0"
          >
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-custom">
                {{ cartItem.name }}
              </h3>
              <p class="text-custom">
                Rp {{ cartItem.price }} x
                {{ cartItem.quantity }}
              </p>
              <p class="text-description text-sm">
                Subtotal: Rp
                {{ cartItem.price * cartItem.quantity }}
              </p>
            </div>
            <div class="flex items-center">
              <input
                v-model.number="cartItem.quantity"
                type="number"
                min="1"
                class="w-16 p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
              />
              <button
                @click="removeFromCart(index)"
                class="ml-4 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
          <div class="text-right font-bold text-xl mt-4">
            Total: Rp {{ cartTotal }}
          </div>
        </div>

        <!-- Proceed to Payment Button -->
        <div class="mt-8 text-center" v-if="cart.length > 0">
          <button
            @click="goToPayment"
            class="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition-colors"
          >
            Proceed to Payment
          </button>
        </div>

        <!-- Empty Cart Message -->
        <div v-else class="text-center mt-8">
          <p class="text-lg text-description">
            Your order is empty. Start adding items!
          </p>
        </div>
      </div>
    </div>
    <div class="absolute top-5 right-5">
      <button
        @click="logout"
        class="bg-description text-custom px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
    <div class="absolute top-5 left-5">
      <router-link
        to="/orders-history"
        class="bg-description text-custom px-4 py-2 rounded"
        >Order History</router-link
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      menu: [],
      cart: JSON.parse(localStorage.getItem("cart")) || [], // Ambil cart dari localStorage jika ada
      loading: true, // Menampilkan loading state
    };
  },
  computed: {
    cartTotal() {
      return this.cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
  },
  methods: {
    async fetchMenu() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/menu-items"
        );
        this.menu = response.data.map((item) => ({
          ...item,
          quantity: 1, // Tambahkan properti quantity untuk setiap item
        }));
      } catch (error) {
        console.error("Error fetching menu:", error);
        alert("Failed to load menu");
      } finally {
        this.loading = false; // Hentikan loading state
      }
    },
    addToCart(item) {
      const cartItem = this.cart.find((i) => i.id === item.id);
      if (cartItem) {
        cartItem.quantity += item.quantity;
      } else {
        this.cart.push({ ...item });
      }

      // Simpan cart ke localStorage setiap kali ada perubahan
      localStorage.setItem("cart", JSON.stringify(this.cart));

      // Reset quantity setelah item ditambahkan
      item.quantity = 1;
    },
    removeFromCart(index) {
      this.cart.splice(index, 1); // Hapus item dari cart
      localStorage.setItem("cart", JSON.stringify(this.cart)); // Update cart di localStorage
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("name");
      this.$router.push("/login"); // Redirect to login page
    },
    async goToPayment() {
      if (this.cart.length === 0) {
        alert("Please add items to the cart.");
        return;
      }

      // Send the order creation request to the API
      try {
        const response = await axios.post(
          "http://localhost:5000/api/orders",
          {
            user_id: localStorage.getItem("userId"), // Ambil userId dari localStorage
            order_items: this.cart.map((item) => ({
              menu_id: item.id,
              quantity: item.quantity,
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Ambil token dari localStorage
            },
          }
        );

        // Store the orderId in localStorage
        localStorage.setItem("orderId", response.data.order_id);

        // Redirect to the payment page
        localStorage.setItem("cart", JSON.stringify([]));
        this.$router.push("/payment");
      } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to create order.");
      }
    },
  },
  mounted() {
    // Fetch data menu ketika komponen di-mount
    this.fetchMenu();
  },
};
</script>

<style scoped>
.back {
  background-color: #e5f9f2;
}

.bg-custom {
  background-color: #b2e0d4;
}

.text-custom {
  color: #0b3d3e;
}

.bg-description {
  background-color: #b7e3d8;
}

.text-description {
  color: #1f1f1f;
}
</style>
