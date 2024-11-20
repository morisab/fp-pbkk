<template>
    <div
        class="min-h-screen bg-back flex flex-col items-center justify-center py-10"
    >
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
                to="/home"
                class="bg-description text-custom px-4 py-2 rounded"
                >Home</router-link
            >
        </div>
        <h1 class="text-4xl font-bold mb-6 text-custom">Riwayat Pesanan</h1>
        <div class="w-full max-w-5xl">
            <div v-if="loading" class="text-center">
                <p class="text-lg text-custom">Memuat riwayat pesanan...</p>
            </div>
            <div v-else>
                <table class="min-w-full bg-white shadow-lg rounded-lg">
                    <thead>
                        <tr class="bg-description">
                            <th class="py-2 px-4 text-left text-custom">
                                Order ID
                            </th>
                            <th class="py-2 px-4 text-left text-custom">
                                Tanggal
                            </th>
                            <th class="py-2 px-4 text-left text-custom">
                                Status
                            </th>
                            <th class="py-2 px-4 text-left text-custom">
                                Total Amount
                            </th>
                            <th class="py-2 px-4 text-left text-custom">
                                Item Pesanan
                            </th>
                            <th class="py-2 px-4 text-left text-custom">
                                Metode Pembayaran
                            </th>
                            <th class="py-2 px-4 text-left text-custom">
                                Review
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.id">
                            <td class="py-2 px-4 border-b">{{ order.id }}</td>
                            <td class="py-2 px-4 border-b">
                                {{ formatDate(order.order_date) }}
                            </td>
                            <td class="py-2 px-4 border-b">
                                {{ order.status }}
                            </td>
                            <td class="py-2 px-4 border-b">
                                {{ formatCurrency(order.total_amount) }}
                            </td>
                            <td class="py-2 px-4 border-b">
                                <ul>
                                    <li
                                        v-for="item in order.order_items"
                                        :key="item.menu_id"
                                    >
                                        {{ getMenuName(item.menu_id) }} -
                                        {{ item.quantity }}
                                    </li>
                                </ul>
                            </td>
                            <td class="py-2 px-4 border-b">
                                {{ order.payment.payment_method }}
                            </td>
                            <td class="py-2 px-4 border-b">
                                <div v-if="!order.review">
                                    <button
                                        @click="navigateToReview(order.id)"
                                        class="bg-green-800 text-white px-4 py-2 rounded"
                                    >
                                        Review Sekarang
                                    </button>
                                </div>
                                <div v-else>
                                    <p>Rating: {{ order.review.rating }}</p>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="orders.length === 0">
                            <td
                                colspan="6"
                                class="py-4 text-center text-description"
                            >
                                Tidak ada riwayat pesanan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router"; // Import useRouter

export default {
    data() {
        return {
            orders: [],
            loading: true,
            menuItems: {}, // Menyimpan data menu
        };
    },
    methods: {
        async fetchOrderHistory() {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/orders/history",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                this.orders = response.data; // Asumsi data adalah array pesanan
            } catch (error) {
                console.error("Error fetching order history:", error);
                alert("Gagal memuat riwayat pesanan.");
            } finally {
                this.loading = false; // Stop loading
            }
        },
        async fetchMenuItems() {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/menu"
                );
                // Simpan data menu dalam bentuk object untuk kemudahan pencarian
                this.menuItems = response.data.reduce((acc, item) => {
                    acc[item.id] = item.name; // Asumsi item memiliki id dan name
                    return acc;
                }, {});
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        },
        getMenuName(menuId) {
            return this.menuItems[menuId] || "Menu tidak ditemukan"; // Mengembalikan nama menu atau pesan jika tidak ditemukan
        },
        navigateToReview(orderId) {
            this.$router.push(`/${orderId}/review`); // Navigate to review page
        },
        formatDate(dateString) {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount);
        },
        logout() {
            localStorage.removeItem("token"); // Remove token from local storage
            this.$router.push("/login"); // Redirect to login page
        },
    },
    async mounted() {
        await Promise.all([this.fetchOrderHistory(), this.fetchMenuItems()]); // Fetch order history and menu items on mount
    },
};
</script>

<style scoped>
.back {
    background-color: #e5f9f2;
}

.bg-description {
    background-color: #b7e3d8;
}

.text-custom {
    color: #0b3d3e;
}

.text-description {
    color: #1f1f1f;
}
</style>
