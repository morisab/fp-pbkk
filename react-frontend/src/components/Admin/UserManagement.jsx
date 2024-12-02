import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // Fungsi untuk mengambil daftar pengguna
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users.");
    }
  }, [token]);

  // Fungsi untuk membuat pengguna baru
  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/users", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user.");
    }
  };

  // Fungsi untuk memperbarui data pengguna
  const updateUser = async (e) => {
    e.preventDefault();
    const payload = {
      name: user.name,
      email: user.email,
      ...(user.password && { password: user.password }),
    };
    try {
      await axios.put(`http://localhost:3000/api/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  // Fungsi untuk menghapus pengguna
  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  // Fungsi untuk mengisi data form saat mengedit pengguna
  const editUser = (user) => {
    setUser({ ...user, password: "", password_confirmation: "" });
    setIsEditing(true);
  };

  // Fungsi untuk mereset form
  const resetForm = () => {
    setUser({
      id: null,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setIsEditing(false);
  };

  // Ambil daftar pengguna saat komponen dirender
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-custom">User Management</h2>

      <form
        onSubmit={isEditing ? updateUser : createUser}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {!isEditing && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  value={user.password_confirmation}
                  onChange={(e) =>
                    setUser({ ...user, password_confirmation: e.target.value })
                  }
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {isEditing ? "Update User" : "Add User"}
          </button>
        </div>
      </form>

      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => editUser(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:underline ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
