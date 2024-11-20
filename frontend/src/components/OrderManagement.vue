<template>
  <div>
    <h2 class="text-3xl font-bold mb-4 text-custom">Order Management</h2>

    <!-- Order List -->
    <table class="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr class="bg-gray-200">
          <th class="py-2 px-4 text-left">Order ID</th>
          <th class="py-2 px-4 text-left">User ID</th>
          <th class="py-2 px-4 text-left">Total Amount</th>
          <th class="py-2 px-4 text-left">Status</th>
          <th class="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="py-2 px-4 border-b">{{ order.id }}</td>
          <td class="py-2 px-4 border-b">{{ order.user_id }}</td>
          <td class="py-2 px-4 border-b">{{ order.total_amount }}</td>
          <td class="py-2 px-4 border-b">{{ order.status }}</td>
          <td class="py-2 px-4 border-b">
            <button
              v-if="order.status === 'pending'"
              @click="confirmOrder(order.id)"
              class="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </td>
        </tr>
        <tr v-if="orders.length === 0">
          <td colspan="5" class="py-4 text-center text-gray-500">
            No orders found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders.");
      }
    },
    async confirmOrder(orderId) {
      const employeeId = prompt("Enter your employee ID:"); // Prompt for employee ID
      if (!employeeId) return; // Exit if no ID is provided

      try {
        const response = await axios.patch(
          `http://localhost:5000/api/orders/${orderId}/confirm`,
          {
            employee_id: employeeId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert(response.data.message);
        await this.fetchOrders(); // Refresh the order list
      } catch (error) {
        console.error("Error confirming order:", error);
        alert("Failed to confirm order.");
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.text-custom {
  color: #0b3d3e;
}
</style>
