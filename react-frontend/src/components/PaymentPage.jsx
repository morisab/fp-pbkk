import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components'; // Import styled-components

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
  font-family: 'Poiret One', cursive;
  color: #1a202c;
`;

const PaymentCard = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  padding: 1.5rem;
  border: 2px solid red;
  width: 24rem;
`;

const Subtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #68d391;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #000000;
  background-color: #fff;
  outline: none;

  &:focus {
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(56, 161, 105, 0.2);
  }
`;

const Button = styled.button`
  background-color: #38a169;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2f855a;
  }

  &:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
  }
`;

const PaymentPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orderId from localStorage and redirect if not present
    const storedOrderId = localStorage.getItem("orderId");
    if (!storedOrderId) {
      alert("No order found. Please create an order first.");
      navigate("/home");
    } else {
      setOrderId(storedOrderId);
    }
  }, [navigate]);

  const confirmPayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/orders/${orderId}/payment`,
        { payment_method: selectedPaymentMethod },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(response.data.message);
      navigate("/order");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment.");
    }
  };

  return (
    <Container>
      <Title>Payment</Title>
      <PaymentCard>
        <Subtitle>Select Payment Method</Subtitle>
        <div>
          <Select
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value="" disabled>
              Select a payment method
            </option>
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Qris">QRIS</option>
          </Select>
        </div>
        <Button
          onClick={confirmPayment}
          disabled={!selectedPaymentMethod}
        >
          Confirm Payment
        </Button>
      </PaymentCard>
    </Container>
  );
};

export default PaymentPage;
