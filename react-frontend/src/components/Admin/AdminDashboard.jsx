import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("name");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-custom">
            Admin Dashboard
          </h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link
                to="/admin/users"
                className="block p-4 text-gray-700 hover:bg-green-100"
              >
                User Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="block p-4 text-gray-700 hover:bg-green-100"
              >
                Order Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/menu"
                className="block p-4 text-gray-700 hover:bg-green-100"
              >
                Menu Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reviews"
                className="block p-4 text-gray-700 hover:bg-green-100"
              >
                Order Reviews
              </Link>
            </li>

            <li>
              <button
                onClick={logout}
                className="block w-full text-left p-4 text-gray-700 hover:bg-red-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-4 text-custom">
          Welcome to the Admin Dashboard
        </h2>
        <Outlet />
        {/* This will render the selected management component */}
      </main>
    </div>
  );
};

export default AdminDashboard;
