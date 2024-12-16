import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderReview = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  // Fungsi untuk mengambil daftar review
  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("Failed to load reviews.");
    }
  };

  // Gunakan useEffect untuk memuat daftar review saat komponen pertama kali dirender
  useEffect(() => {
    fetchReviews();
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-custom">Order Reviews</h2>

      {/* Daftar Review */}
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Review ID</th>
            <th className="py-2 px-4 text-left">Rating</th>
            <th className="py-2 px-4 text-left">Comment</th>
            <th className="py-2 px-4 text-left">Order ID</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review.id}>
                <td className="py-2 px-4 border-b">{review.id}</td>
                <td className="py-2 px-4 border-b">{review.rating}</td>
                <td className="py-2 px-4 border-b">{review.comment}</td>
                <td className="py-2 px-4 border-b">{review.order_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center text-gray-500">
                No reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderReview;
