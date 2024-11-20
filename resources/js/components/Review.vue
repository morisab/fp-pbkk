<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <h1 class="text-2xl font-bold text-center text-custom mb-4">
                Review Order #{{ orderId }}
            </h1>
            <form @submit.prevent="submitReview">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700"
                        >Rating:</label
                    >
                    <div class="flex space-x-2 mt-1">
                        <label
                            v-for="num in 5"
                            :key="num"
                            class="flex items-center"
                        >
                            <input
                                type="radio"
                                v-model="rating"
                                :value="num"
                                class="mr-1"
                                required
                            />
                            <span>{{ num }}</span>
                        </label>
                    </div>
                </div>
                <div class="mb-4">
                    <label
                        for="comment"
                        class="block text-sm font-medium text-gray-700"
                        >Comment:</label
                    >
                    <textarea
                        v-model="comment"
                        maxlength="255"
                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition disabled:opacity-50"
                >
                    {{ loading ? "Mengirim..." : "Kirim Review" }}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            orderId: this.$route.params.orderId,
            rating: "", // Default rating is empty
            comment: "",
            loading: false, // Loading state for submission
        };
    },
    methods: {
        async submitReview() {
            if (!this.rating || !this.comment) {
                alert("Please provide a rating and a comment."); // Validation message
                return;
            }

            this.loading = true; // Set loading state to true

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/orders/${this.orderId}/review`,
                    {
                        rating: this.rating,
                        comment: this.comment,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                this.showSuccess("Review berhasil dikirim!");
                this.$router.push("/orders-history");
            } catch (error) {
                console.error("Error submitting review:", error);
                alert("Gagal mengirim review.");
            } finally {
                this.loading = false; // Reset loading state
            }
        },
        showSuccess(message) {
            // Replace this with your preferred notification method
            alert(message);
        },
    },
};
</script>

<style scoped>
.text-custom {
    color: #0b3d3e; /* Custom color for headings */
}
</style>
