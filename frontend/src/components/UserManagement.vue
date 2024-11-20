<template>
  <div>
    <h2 class="text-3xl font-bold mb-4 text-custom">User Management</h2>

    <form
      @submit.prevent="isEditing ? updateUser() : createUser()"
      class="mb-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="name"
            v-model="user.name"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="user.email"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div v-if="!isEditing">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="user.password"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div v-if="!isEditing">
          <label
            for="password_confirmation"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            type="password"
            id="password_confirmation"
            v-model="user.password_confirmation"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div v-if="isEditing">
          <label
            for="new_password"
            class="block text-sm font-medium text-gray-700"
            >New Password (Leave blank to keep current)</label
          >
          <input
            type="password"
            id="new_password"
            v-model="user.password"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div v-if="isEditing">
          <label
            for="new_password_confirmation"
            class="block text-sm font-medium text-gray-700"
            >Confirm New Password</label
          >
          <input
            type="password"
            id="new_password_confirmation"
            v-model="user.password_confirmation"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div class="mt-4">
        <button
          type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          {{ isEditing ? "Update User" : "Add User" }}
        </button>
      </div>
    </form>

    <table class="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr class="bg-gray-200">
          <th class="py-2 px-4 text-left">Name</th>
          <th class="py-2 px-4 text-left">Email</th>
          <th class="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="py-2 px-4 border-b">{{ user.name }}</td>
          <td class="py-2 px-4 border-b">{{ user.email }}</td>
          <td class="py-2 px-4 border-b">
            <button
              @click="editUser(user)"
              class="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              @click="deleteUser(user.id)"
              class="text-red-600 hover:underline ml-4"
            >
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="3" class="py-4 text-center text-gray-500">
            No users found.
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
      users: [],
      user: {
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
      isEditing: false,
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users.");
      }
    },
    async createUser() {
      try {
        await axios.post("http://localhost:5000/api/users", this.user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.resetForm();
        await this.fetchUsers();
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user.");
      }
    },
    async updateUser() {
      const payload = {
        name: this.user.name,
        email: this.user.email,
        ...(this.user.password && { password: this.user.password }),
      };
      try {
        await axios.put(
          `http://localhost:5000/api/users/${this.user.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.resetForm();
        await this.fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
      }
    },
    async deleteUser(id) {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await axios.delete(`http://localhost:5000/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          await this.fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
        }
      }
    },
    editUser(user) {
      this.user = { ...user, password: "", password_confirmation: "" };
      this.isEditing = true;
    },
    resetForm() {
      this.user = {
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      };
      this.isEditing = false;
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.text-custom {
  color: #0b3d3e;
}
</style>
