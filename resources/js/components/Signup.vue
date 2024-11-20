<template>
    <div class="flex items-center justify-center h-screen">
        <div class="flex bg-white rounded-lg shadow-lg w-full max-w-4xl">
            <!-- Kotak Kiri: Form Pendaftaran -->
            <div class="w-1/2 p-8 bg-custom rounded-l-lg">
                <h1 class="text-2xl font-semibold text-custom text-center mb-4">
                    Register
                </h1>
                <p class="text-center text-custom mb-6">Create a new account</p>

                <form @submit.prevent="registerUser">
                    <div class="mb-4">
                        <label
                            for="name"
                            class="block text-sm font-medium text-custom"
                            >Name</label
                        >
                        <input
                            v-model="name"
                            type="text"
                            id="name"
                            name="name"
                            required
                            class="mt-1 block w-full p-2 bg-white border border-green-300 rounded focus:outline-none focus:ring focus:ring-green-300"
                            placeholder="Enter your name"
                        />
                    </div>
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
                    <div class="mb-4">
                        <label
                            for="password_confirmation"
                            class="block text-sm font-medium text-custom"
                            >Confirm Password</label
                        >
                        <input
                            v-model="password_confirmation"
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            required
                            class="mt-1 block w-full p-2 bg-white border border-green-300 rounded focus:outline-none focus:ring focus:ring-green-300"
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button
                        type="submit"
                        class="w-full bg-green-800 text-white font-semibold py-2 rounded"
                    >
                        REGISTER
                    </button>
                </form>
                <div class="mt-2 text-center">
                    <p class="text-sm text-custom">
                        Already have an account?
                        <router-link
                            to="/login"
                            class="text-custom hover:underline"
                            >LOG IN</router-link
                        >
                    </p>
                </div>
            </div>

            <!-- Kotak Kanan: Deskripsi -->
            <div class="w-1/2 p-8 bg-description text-description rounded-r-lg">
                <h2 class="text-2xl font-semibold mb-4">Join Us Today</h2>
                <p class="mb-4">
                    Become a part of the Hasu community and enjoy our unique
                    offerings that cater to your senses. Experience comfort and
                    joy with every sip.
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
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        };
    },
    methods: {
        async registerUser() {
            try {
                const response = await axios.post("/api/register", {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                });
                console.log(response.data);
                // Redirect atau aksi setelah pendaftaran berhasil
                this.$router.push("/login"); // Arahkan pengguna ke halaman login setelah pendaftaran
            } catch (error) {
                console.error(
                    "Registration failed:",
                    error.response ? error.response.data : error
                );
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

.bg-description {
    background-color: #b7e3d8;
}

.text-description {
    color: #1f1f1f;
}
</style>
