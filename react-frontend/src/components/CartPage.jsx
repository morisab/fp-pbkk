import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components"; // Import styled-components

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  transition: all 0.3s;
  background-color: ${(props) => (props.isScrolled ? "white" : "transparent")};
  box-shadow: ${(props) => (props.isScrolled ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none")};
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 100%;
  
  > div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  color: #1a202c;
`;

const Button = styled.button`
  background-color: #f70202;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #780505;
  }
`;

const CartSection = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  padding: 10rem 0;
`;

const CartContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const CartTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1a202c;
  font-family: 'Poiret One', cursive;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const CartItemInfo = styled.div`
  flex-grow: 1;
`;

const CartItemName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const CartItemPrice = styled.p`
  color: #4a5568;
`;

const CartItemSubtotal = styled.p`
  color: #9e0b0b;
  font-weight: bold;
  font-size: 1rem;
`;

const QuantityInput = styled.input`
  width: 4rem;
  padding: 0.5rem;
  border: 1px solid #000;
  border-radius: 0.375rem;
  margin-right: 1rem;
  &:focus {
    outline: none;
    border-color: #38a169;
  }
`;

const RemoveButton = styled.button`
  background-color: #e53e3e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  &:hover {
    background-color: #c53030;
  }
`;

const Total = styled.div`
  text-align: right;
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 1rem;
`;

const ProceedButton = styled.button`
  background-color: #38a169;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.25rem;
  width: 100%;
  margin-top: 2rem;
  &:hover {
    background-color: #2f855a;
  }
`;

// CartPage Component
const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const name = localStorage.getItem("name");
    setUserName(name ? name : "Guest");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProceedToPayment = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add items to proceed.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Please log in to proceed.");
      navigate("/login");
      return;
    }

    const orderItems = cart.map((item) => ({
      menu_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const response = await axios.post("http://localhost:3000/api/orders", {
        user_id: userId,
        order_items: orderItems,
      });

      const { order_id } = response.data;
      alert(`Order created successfully with ID: ${order_id}`);
      localStorage.setItem("orderId", order_id); // Simpan orderId di localStorage
      navigate("/payment"); // Redirect ke halaman pembayaran
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled}>
        <NavbarContent>
          <Title onClick={() => navigate("/dashboard")}>Dashboard</Title>
          <div>
            <Button onClick={() => navigate("/cart")}>Cart</Button>
            <div style={{ position: "relative" }}>
              <Button onClick={() => setDropdownOpen(!dropdownOpen)}>
                {userName}
              </Button>
              {dropdownOpen && (
                <div style={{ position: "absolute", right: 0, backgroundColor: "white", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "0.375rem", marginTop: "0.5rem", width: "200px" }}>
                  <a href="/profile" style={{ padding: "1rem", textDecoration: "none", color: "#1a202c", display: "block" }}>My Profile</a>
                  <a href="/orders-history" style={{ padding: "1rem", textDecoration: "none", color: "#1a202c", display: "block" }}>Order History</a>
                  <button onClick={logout} style={{ width: "100%", padding: "1rem", background: "none", textAlign: "left", border: "none", color: "#1a202c" }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </NavbarContent>
      </Navbar>

      <CartSection>
        <CartContainer>
          <CartTitle>Your Cart</CartTitle> {/* Font Poiret One diterapkan di sini */}

          {cart.length > 0 ? (
            <div>
              {cart.map((cartItem, index) => (
                <CartItem key={cartItem.id}>
                  <CartItemInfo>
                    <CartItemName>{cartItem.name}</CartItemName>
                    <CartItemPrice>Rp {cartItem.price} x {cartItem.quantity}</CartItemPrice>
                    <CartItemSubtotal>Subtotal: Rp {cartItem.price * cartItem.quantity}</CartItemSubtotal>
                  </CartItemInfo>
                  <div>
                    <QuantityInput
                      type="number"
                      value={cartItem.quantity}
                      min="1"
                      onChange={(e) => {
                        const updatedCart = [...cart];
                        updatedCart[index].quantity = parseInt(e.target.value, 10);
                        setCart(updatedCart);
                        localStorage.setItem("cart", JSON.stringify(updatedCart));
                      }}
                    />
                    <RemoveButton onClick={() => removeFromCart(index)}>Remove</RemoveButton>
                  </div>
                </CartItem>
              ))}
              <Total>Total: Rp {calculateTotal()}</Total>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <p>Your cart is empty. Start adding items!</p>
            </div>
          )}

          {cart.length > 0 && (
            <ProceedButton onClick={handleProceedToPayment}>Proceed to Payment</ProceedButton>
          )}
        </CartContainer>
      </CartSection>
    </Container>
  );
};

export default CartPage;
