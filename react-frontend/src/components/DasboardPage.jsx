import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components'; // Import styled-components

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  padding: 10rem 0;
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
    gap: 1rem; /* Spasi antara Cart dan UserMenu */
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

const UserMenu = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  width: 200px;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 1rem;
  color: #1a202c;
  font-weight: 500;
  text-decoration: none;
  &:hover {
    background-color: #f4f4f4;
  }
`;

const MenuSection = styled.div`
  max-width: 1024px;
  margin-top: 2rem;
  width: 100%;
`;

const MenuTitle = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #1a202c;
  font-family: 'Rouge Script', cursive;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MenuCard = styled.div`
  background-color: #fff;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: 2px solid red;
  &:hover {
    transform: scale(1.05);
  }
`;

const MenuImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 0.375rem 0.375rem 0 0;
`;

const MenuDetails = styled.div`
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Tambahkan jarak antar elemen */
`;

const MenuName = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a202c;
  font-family: 'Tinos', serif;
`;

const MenuDescription = styled.p`
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const MenuPrice = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #9e0b0b;
  margin-bottom: 1rem;
`;

const InputQuantity = styled.input`
  width: 4rem;
  padding: 0.5rem;
  border: 1px solid #000000;
  border-radius: 0.375rem;
  margin-right: 1rem;
  &:focus {
    outline: none;
    border-color: #38a169;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 1rem; /* Atur jarak dari atas layar */
  left: 50%;
  transform: translateX(-50%);
  background-color: #38a169;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  z-index: 9999; /* Pastikan ini berada di atas navbar */
`;

// Komponen Dashboard
const DashboardPage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [notification, setNotification] = useState(""); // State untuk notifikasi
  const [showNotification, setShowNotification] = useState(false); // Menambah state untuk kontrol notifikasi
  const navigate = useNavigate(); // Hook untuk navigasi

  const fetchMenu = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated!");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/menu-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMenu(
        response.data.map((item) => ({
          ...item,
          quantity: 1,
        }))
      );

      const name = localStorage.getItem("name");
      setUserName(name ? name : "Guest");
    } catch (error) {
      console.error("Error fetching menu:", error);
      alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (item, value) => {
    if (value >= 1) {
      item.quantity = value;
      setMenu([...menu]); // Memperbarui state menu
    }
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find((i) => i.id === item.id);

    if (cartItem) {
      cartItem.quantity += item.quantity;
    } else {
      cart.push({ ...item });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    item.quantity = 1;

    // Menampilkan notifikasi setelah item ditambahkan ke cart
    setNotification("Added to Cart");
    setShowNotification(true); // Mulai menampilkan notifikasi dengan animasi
    setTimeout(() => {
      setShowNotification(false); // Sembunyikan notifikasi setelah 3 detik
    }, 3000);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchMenu();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container>
      <Navbar isScrolled={isScrolled}>
        <NavbarContent>
          <Title onClick={() => navigate("/dashboard")}>Dashboard</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button onClick={() => navigate("/cart")}>Cart</Button>
            <UserMenu>
              <Button onClick={() => setDropdownOpen(!dropdownOpen)}>{userName}</Button>
              {dropdownOpen && (
                <DropdownMenu>
                  <DropdownItem href="/profile">My Profile</DropdownItem>
                  <DropdownItem href="/orders-history">Order History</DropdownItem>
                  <DropdownItem onClick={logout}>Logout</DropdownItem>
                </DropdownMenu>
              )}
            </UserMenu>
          </div>
        </NavbarContent>
      </Navbar>

      <MenuSection>
        <MenuTitle>From Our Menu</MenuTitle>

        {loading && (
          <div className="text-center">
            <p>Loading menu...</p>
          </div>
        )}

        {!loading && menu.length > 0 && (
          <MenuGrid>
            {menu.map((item) => (
              <MenuCard key={item.id}>
                <MenuImage src={item.image_url} alt={item.name} />
                <MenuDetails>
                  <MenuName>{item.name}</MenuName>
                  <MenuDescription>{item.description}</MenuDescription>
                  <MenuPrice>Rp {item.price}</MenuPrice>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <InputQuantity
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, parseInt(e.target.value, 10))}
                      type="number"
                      min="1"
                      placeholder="Qty"
                    />
                    <Button onClick={() => addToCart(item)}>Add</Button>
                  </div>
                </MenuDetails>
              </MenuCard>
            ))}
          </MenuGrid>
        )}

        {!loading && menu.length === 0 && (
          <div className="text-center">
            <p>No menu available.</p>
          </div>
        )}
      </MenuSection>

      <Notification show={showNotification}>{notification}</Notification>
    </Container>
  );
};

export default DashboardPage;
