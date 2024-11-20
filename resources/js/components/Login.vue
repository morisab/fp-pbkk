<template>
    <div class="flex items-center justify-center h-screen">
        <div class="flex bg-white rounded-lg shadow-lg w-full max-w-4xl">
            <!-- Kotak Kiri: Kredensial Login -->
            <div class="w-1/2 p-8 bg-custom rounded-l-lg">
                <h1 class="text-2xl font-semibold text-custom text-center mb-4">
                    HASU
                </h1>
                <p class="text-center text-custom mb-6">
                    Please login to your account
                </p>

                <form @submit.prevent="loginUser">
                    <div class="mb-4">
                        <label
                            for="email"
                            class="block text-sm font-medium text-custom"
                            >Email</label
                        >
                        <input
                            v-model="email"
                            type="email"
                            id="email"
                            name="email"
                            required
                            class="mt-1 block w-full p-2 bg-white border border-green-300 rounded focus:outline-none focus:ring focus:ring-green-300"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div class="mb-4">
                        <label
                            for="password"
                            class="block text-sm font-medium text-custom"
                            >Password</label
                        >
                        <input
                            v-model="password"
                            type="password"
                            id="password"
                            name="password"
                            required
                            class="mt-1 block w-full p-2 bg-white border border-green-300 rounded focus:outline-none focus:ring focus:ring-green-300"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        class="w-full bg-green-800 text-white font-semibold py-2 rounded"
                    >
                        LOG IN
                    </button>
                </form>
                <div class="mt-2 text-center">
                    <p class="text-sm text-custom">
                        Don't have an account?
                        <router-link
                            to="/signup"
                            class="text-custom hover:underline"
                            >REGISTER</router-link
                        >
                    </p>
                </div>
            </div>

            <!-- Kotak Kanan: Deskripsi -->
            <div class="w-1/2 p-8 bg-description text-description rounded-r-lg">
                <h2 class="text-2xl font-semibold mb-4">
                    Bloom with Every Sip
                </h2>
                <p class="mb-4">
                    Embrace tranquility with each delightful sip at Hasu, where
                    every moment is a fusion of harmony and serenity. Experience
                    the blend of peace and joy that fills the air, creating a
                    unique sanctuary for you to unwind and relish the simple
                    pleasures of life.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post("/api/login", {
                    email: this.email,
                    password: this.password,
                });
                console.log(response.data);
                // Simpan token di localStorage
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("name", response.data.name);

                // Cek apakah user adalah admin
                if (response.data.isAdmin) {
                    // Arahkan ke halaman admin jika is_admin true
                    this.$router.push("/admin");
                } else {
                    // Arahkan ke halaman home untuk user biasa
                    this.$router.push("/home");
                }
            } catch (error) {
                console.error("Login failed:", error);
                // Tambahkan penanganan error di sini, misalnya dengan menampilkan pesan kesalahan
            }
        },
    },
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

.bg-description {
    background-color: #b7e3d8;
}

.text-description {
    color: #1f1f1f;
}
</style>
