<template>
  <div>
    <h2 class="text-3xl font-bold mb-4 text-custom">Menu Management</h2>

    <!-- Add Menu Form -->
    <form
      @submit.prevent="isEditing ? updateMenu() : createMenu()"
      class="mb-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Menu Name</label
          >
          <input
            type="text"
            id="name"
            v-model="menu.name"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700"
            >Price</label
          >
          <input
            type="number"
            id="price"
            v-model="menu.price"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            id="description"
            v-model="menu.description"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700"
            >Category</label
          >
          <input
            type="text"
            id="category"
            v-model="menu.category"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div class="mt-4">
        <button
          type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          {{ isEditing ? "Update Menu" : "Add Menu" }}
        </button>
      </div>
    </form>

    <!-- Menu List -->
    <table class="min-w-full bg-white shadow-md rounded-lg">
      <thead>
        <tr class="bg-gray-200">
          <th class="py-2 px-4 text-left">Menu Name</th>
          <th class="py-2 px-4 text-left">Price</th>
          <th class="py-2 px-4 text-left">Description</th>
          <th class="py-2 px-4 text-left">Category</th>
          <th class="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="menu in menus" :key="menu.id">
          <td class="py-2 px-4 border-b">{{ menu.name }}</td>
          <td class="py-2 px-4 border-b">{{ menu.price }}</td>
          <td class="py-2 px-4 border-b">{{ menu.description }}</td>
          <td class="py-2 px-4 border-b">{{ menu.category }}</td>
          <td class="py-2 px-4 border-b">
            <button
              @click="editMenu(menu)"
              class="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              @click="deleteMenu(menu.id)"
              class="text-red-600 hover:underline ml-4"
            >
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="menus.length === 0">
          <td colspan="5" class="py-4 text-center text-gray-500">
            No menus found.
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
      menus: [],
      menu: {
        id: null,
        name: "",
        price: null,
        description: "",
        category: "",
      },
      isEditing: false,
    };
  },
  methods: {
    async fetchMenus() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/menu-items",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.menus = response.data;
      } catch (error) {
        console.error("Error fetching menus:", error);
        alert("Failed to load menus.");
      }
    },
    async createMenu() {
      try {
        await axios.post("http://localhost:5000/api/menu", this.menu, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.resetForm();
        await this.fetchMenus();
      } catch (error) {
        console.error("Error creating menu:", error);
        alert("Failed to create menu.");
      }
    },
    async updateMenu() {
      try {
        await axios.put(
          `http://localhost:5000/api/menu/${this.menu.id}`,
          this.menu,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.resetForm();
        await this.fetchMenus();
      } catch (error) {
        console.error("Error updating menu:", error);
        alert("Failed to update menu.");
      }
    },
    async deleteMenu(id) {
      if (confirm("Are you sure you want to delete this menu?")) {
        try {
          await axios.delete(`http://localhost:5000/api/menu/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          await this.fetchMenus();
        } catch (error) {
          console.error("Error deleting menu:", error);
          alert("Failed to delete menu.");
        }
      }
    },
    editMenu(menu) {
      this.menu = { ...menu };
      this.isEditing = true;
    },
    resetForm() {
      this.menu = {
        id: null,
        name: "",
        price: null,
        description: "",
        category: "",
      };
      this.isEditing = false;
    },
  },
  mounted() {
    this.fetchMenus();
  },
};
</script>

<style scoped>
.text-custom {
  color: #0b3d3e;
}
</style>
