<template>
    <div class="flex items-center justify-center min-h-screen bg-custom">
        <div
            class="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg w-full max-w-xl p-8"
        >
            <h1 class="text-3xl font-semibold text-custom mb-4">
                Welcome to HASU
            </h1>
            <p class="text-center text-custom mb-6">Bloom with Every Sip.</p>
            <div class="flex space-x-4">
                <router-link
                    to="/login"
                    class="bg-green-800 hover:bg-hover-bg text-white font-semibold py-2 px-4 rounded"
                    >LOG IN</router-link
                >
                <router-link
                    to="/signup"
                    class="bg-green-800 hover:bg-hover-bg text-white font-semibold py-2 px-4 rounded"
                    >REGISTER</router-link
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LandingPage",
};
</script>

<style scoped>
body {
    background-color: #e5f9f2;
}

.bg-custom {
    background-color: #b2e0d4;
}

.text-custom {
    color: #0b3d3e;
}

.hover-bg {
    background-color: #a4d5d0;
}
</style>
