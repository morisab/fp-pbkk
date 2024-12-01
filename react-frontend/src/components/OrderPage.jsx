import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"; // Import styled-components

// Styled-components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
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

const Description = styled.p`
  font-size: 1.125rem;
  text-align: center;
  color: #4a5568;
  margin-bottom: 2rem;
`;

const DashboardButton = styled.button`
  background-color: #edf2f7;
  color: #2d3748;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    color: #fafafa;
    background-color: #d40f0f;
  }
`;

const OrderPage = () => {
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve orderId from localStorage when the component mounts
    const storedOrderId = localStorage.getItem("orderId");
    if (storedOrderId) {
      setOrderId(storedOrderId);
    } else {
      alert("No order found. Please create an order first.");
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <Container>
      <Title>Order ID: {orderId}</Title>
      <Description>
        Silakan ke kasir untuk melakukan konfirmasi pesanan Anda. :3
      </Description>

      <DashboardButton onClick={() => navigate("/dashboard")}>
        Dashboard
      </DashboardButton>
    </Container>
  );
};

export default OrderPage;
