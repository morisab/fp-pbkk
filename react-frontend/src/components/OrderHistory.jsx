import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

// Styled-components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  background-color: #1381f0;
  padding: 1rem 1.5rem;
`;

const NavbarButton = styled.button`
  background-color: transparent;
  color: #f7f7f7;
  font-weight: bold;
  font-size: 1.125rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #4a5568;
  }
`;

const LogoutButton = styled.button`
  background-color: #edf2f7;
  color: #2d3748;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e2e8f0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1a202c;
`;

const TableWrapper = styled.div`
  width: calc(100% - 16px); /* Lebar penuh dengan margin */
  margin: 0 8px; /* Margin 8px di kanan dan kiri */
  max-width: 100%; /* Maksimal lebar 100% */
  overflow-x: auto; /* Untuk memastikan tabel scrollable jika lebar melebihi */
`;

const Table = styled.table`
  width: 100%;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  margin-top: 1rem;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #65a5e6;
  color: #2d3748;
  font-size: 1.125rem;
  border: 2px solid #2d3748;
  width: 15%;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #2d3748;
  text-align: left;
  border-left: 1px solid #2d3748;
  border-right: 1px solid #2d3748;

  &.order-id-cell {
    font-size: 1.25rem;
    padding: 1.5rem;
    width: 7%;
  }
`;

const Button = styled.button`
  background-color: #2d3748;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4a5568;
  }
`;

const NoOrdersMessage = styled.p`
  text-align: center;
  color: #4a5568;
  font-size: 1.125rem;
  padding: 1rem;
`;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/orders/history",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
        alert("Gagal memuat riwayat pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const navigateToReview = (orderId) => {
    navigate(`/order/${orderId}/review`);
  };

  const navigateToOrder = () => {
    navigate(`/order`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <Container>
      {/* Navbar */}
      <Navbar>
        <div className="flex justify-between items-center">
          <NavbarButton onClick={() => navigate("/dashboard")}>
            Dashboard
          </NavbarButton>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </div>
      </Navbar>

      {/* Content */}
      <Content>
        <Title>Riwayat Pesanan</Title>
        <TableWrapper>
          {loading ? (
            <NoOrdersMessage>Memuat riwayat pesanan...</NoOrdersMessage>
          ) : (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Order ID</TableHeader>
                  <TableHeader>Tanggal</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Total Amount</TableHeader>
                  <TableHeader>Item Pesanan</TableHeader>
                  <TableHeader>Metode Pembayaran</TableHeader>
                  <TableHeader>Review</TableHeader>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.order_id}>
                      <TableCell className="order-id-cell">
                        {order.order_id}
                      </TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <ul>
                          {order.items.map((item) => (
                            <li key={item.menu_name}>
                              {item.menu_name} - {item.quantity} x{" "}
                              {formatCurrency(item.price)}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{order.payment_method}</TableCell>
                      <TableCell>
                        {!order.review ? (
                          order.status !== "paid" ? (
                            <Button onClick={navigateToOrder}>
                              Selesaikan Pembayaran
                            </Button>
                          ) : (
                            <Button
                              onClick={() => navigateToReview(order.order_id)}
                            >
                              Review Sekarang
                            </Button>
                          )
                        ) : order.review.rating !== null ? (
                          <p>Rating: {order.review.rating}</p>
                        ) : (
                          <p>Belum ada review</p>
                        )}
                      </TableCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <TableCell colSpan="7" className="text-center">
                      Tidak ada riwayat pesanan.
                    </TableCell>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </TableWrapper>
      </Content>
    </Container>
  );
};

export default OrderHistory;
