import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [menu, setMenu] = useState({
    id: null,
    name: "",
    price: null,
    description: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // Fungsi untuk mengambil data menu
  const fetchMenus = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/menu-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      alert("Failed to load menus.");
    }
  }, [token]);

  // Fungsi untuk membuat menu baru
  const createMenu = async () => {
    try {
      await axios.post("http://localhost:3000/api/menu-items", menu, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchMenus();
    } catch (error) {
      console.error("Error creating menu:", error);
      alert("Failed to create menu.");
    }
  };

  // Fungsi untuk mengupdate menu yang sudah ada
  const updateMenu = async () => {
    try {
      await axios.put(`http://localhost:3000/api/menu-items/${menu.id}`, menu, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchMenus();
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("Failed to update menu.");
    }
  };

  // Fungsi untuk menghapus menu
  const deleteMenu = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        await axios.delete(`http://localhost:3000/api/menu-items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMenus();
      } catch (error) {
        console.error("Error deleting menu:", error);
        alert("Failed to delete menu.");
      }
    }
  };

  // Fungsi untuk mengedit menu
  const editMenu = (menu) => {
    setMenu({ ...menu });
    setIsEditing(true);
  };

  // Fungsi untuk mereset form
  const resetForm = () => {
    setMenu({
      id: null,
      name: "",
      price: null,
      description: "",
      category: "",
    });
    setIsEditing(false);
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    isEditing ? updateMenu() : createMenu();
  };

  // useEffect untuk mengambil data saat komponen pertama kali dirender
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-custom">Menu Management</h2>

      {/* Add/Edit Menu Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Menu Name
            </label>
            <input
              type="text"
              id="name"
              value={menu.name}
              onChange={(e) => setMenu({ ...menu, name: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              value={menu.price || ""}
              onChange={(e) =>
                setMenu({ ...menu, price: Number(e.target.value) })
              }
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={menu.description}
              onChange={(e) =>
                setMenu({ ...menu, description: e.target.value })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              value={menu.category}
              onChange={(e) => setMenu({ ...menu, category: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {isEditing ? "Update Menu" : "Add Menu"}
          </button>
        </div>
      </form>

      {/* Menu List */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Menu Name</th>
            <th className="py-2 px-4 text-left">Price</th>
            <th className="py-2 px-4 text-left">Description</th>
            <th className="py-2 px-4 text-left">Category</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.length > 0 ? (
            menus.map((menu) => (
              <tr key={menu.id}>
                <td className="py-2 px-4 border-b">{menu.name}</td>
                <td className="py-2 px-4 border-b">{menu.price}</td>
                <td className="py-2 px-4 border-b">{menu.description}</td>
                <td className="py-2 px-4 border-b">{menu.category}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => editMenu(menu)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenu(menu.id)}
                    className="text-red-600 hover:underline ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No menus found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManagement;
