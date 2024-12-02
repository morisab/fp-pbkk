import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  // Fungsi untuk mengambil daftar pesanan
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders.");
    }
  }, [token]);

  // Fungsi untuk mengonfirmasi pesanan
  const confirmOrder = async (orderId) => {
    const employeeId = prompt("Enter your employee ID:");
    if (!employeeId) return;
  
    const token = localStorage.getItem("token");
    
    // Debugging: Log the token to ensure it is correct
    console.log('Authorization Token:', token);
  
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/orders/${orderId}/confirm`,
        { employee_id: employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is being sent here
          },
        }
      );
      alert(response.data.message);
      fetchOrders(); // Refresh daftar pesanan setelah konfirmasi
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order.");
    }
  };
  

  // Gunakan useEffect untuk memuat daftar pesanan saat komponen pertama kali dirender
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-custom">Order Management</h2>

      {/* Daftar Pesanan */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">User ID</th>
            <th className="py-2 px-4 text-left">Total Amount</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.user_id}</td>
                <td className="py-2 px-4 border-b">{order.total_amount}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  {order.status === "pending" && (
                    <button
                      onClick={() => confirmOrder(order.id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
