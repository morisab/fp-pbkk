<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-center text-custom">
          Admin Dashboard
        </h1>
      </div>
      <nav class="mt-6">
        <ul>
          <li>
            <router-link
              to="/admin/users"
              class="block p-4 text-gray-700 hover:bg-green-100"
              >User Management</router-link
            >
          </li>
          <li>
            <router-link
              to="/admin/orders"
              class="block p-4 text-gray-700 hover:bg-green-100"
              >Order Management</router-link
            >
          </li>
          <li>
            <router-link
              to="/admin/menu"
              class="block p-4 text-gray-700 hover:bg-green-100"
              >Menu Management</router-link
            >
          </li>
          <li>
            <button
              @click="logout"
              class="block w-full text-left p-4 text-gray-700 hover:bg-red-100"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <h2 class="text-3xl font-bold mb-4 text-custom">
        Welcome to the Admin Dashboard
      </h2>
      <router-view></router-view>
      <!-- This will render the selected management component -->
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("name");
      this.$router.push("/login"); // Redirect to login page
    },
  },
};
</script>

<style scoped>
.text-custom {
  color: #0b3d3e;
}
</style>
