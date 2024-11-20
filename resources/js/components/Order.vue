<template>
    <div
        class="min-h-screen bg-back flex flex-col items-center justify-center py-10"
    >
        <h1 class="text-4xl font-bold mb-4 text-custom">
            Order ID: {{ orderId }}
        </h1>
        <p class="text-lg text-center text-description">
            Silakan ke kasir untuk melakukan konfirmasi pesanan Anda. :3
        </p>
    </div>
    <div class="absolute top-5 right-5">
        <router-link
            to="/home"
            class="bg-description text-custom px-4 py-2 rounded"
            >Home</router-link
        >
    </div>
</template>

<script>
export default {
    data() {
        return {
            orderId: null,
        };
    },
    mounted() {
        // Mengambil orderId dari localStorage
        this.orderId = localStorage.getItem("orderId");
    },
};
</script>

<style scoped>
.back {
    background-color: #e5f9f2;
}

.text-custom {
    color: #0b3d3e;
}

.text-description {
    color: #1f1f1f;
}

.bg-description {
    background-color: #b7e3d8;
}
</style>
