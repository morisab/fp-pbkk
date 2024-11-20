<template>
    <div
        class="min-h-screen bg-back flex flex-col justify-center items-center py-10"
    >
        <h1 class="text-4xl font-bold mb-6 text-custom">Payment</h1>
        <div class="bg-description shadow-lg rounded-lg p-6 w-96">
            <h2 class="text-xl font-bold mb-4 text-custom">
                Select Payment Method
            </h2>
            <div>
                <select
                    v-model="selectedPaymentMethod"
                    class="border border-green-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-green-900"
                >
                    <option value="" disabled>Select a payment method</option>
                    <option value="Cash">Cash</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Qris">QRIS</option>
                </select>
            </div>
            <button
                @click="confirmPayment"
                class="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                :disabled="!selectedPaymentMethod"
            >
                Confirm Payment
            </button>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            selectedPaymentMethod: "",
            orderId: null, // Store orderId here
        };
    },
    methods: {
        async confirmPayment() {
            try {
                this.orderId = localStorage.getItem("orderId");

                const response = await axios.post(
                    `http://localhost:8000/api/orders/${this.orderId}/payment`,
                    {
                        payment_method: this.selectedPaymentMethod,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                alert(response.data.message);
                this.$router.push("/order");
            } catch (error) {
                console.error("Error processing payment:", error);
                alert("Failed to process payment.");
            }
        },
    },
    mounted() {
        if (!localStorage.getItem("orderId")) {
            alert("No order found. Please create an order first.");
            this.$router.push("/home");
        }
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
</style>
