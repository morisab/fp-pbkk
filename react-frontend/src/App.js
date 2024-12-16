import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DasboardPage";
import CartPage from "./components/CartPage";
import PaymentPage from "./components/PaymentPage";
import OrderPage from "./components/OrderPage";
import OrderHistory from "./components/OrderHistory";
import ReviewPage from "./components/ReviewPage";
import "./App.css";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserManagement from "./components/Admin/UserManagement";
import OrderManagement from "./components/Admin/OrderManagement";
import MenuManagement from "./components/Admin/MenuManagement";
import OrderReview from "./components/Admin/OrderReview";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/orders-history" element={<OrderHistory />} />
          <Route path="/order/:id/review" element={<ReviewPage />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="reviews" element={<OrderReview />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
