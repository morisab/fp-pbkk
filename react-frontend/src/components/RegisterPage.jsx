import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled-components untuk container dengan background image
const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/images/Login-Register.jpg'); /* Ganti dengan path gambar Anda */
  background-size: cover;
  background-position: center;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid red;
`;

const TextCustom = styled.p`
  text-align: center;
  color: #ff0303;
  font-size: 16px;
  margin-bottom: 24px;
  font-style: italic;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4A4A4A;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #ff0303;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }
`;

// Styled-components untuk tombol Register
const RegisterButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f70c0c; /* Warna latar belakang tombol */
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #a61616; /* Warna latar belakang saat hover */
  }

  &:active {
    background-color: #388e3c; /* Warna latar belakang saat tombol ditekan */
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.6); /* Efek focus */
  }
`;

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <RegisterContainer>
      <FormContainer>
        <h1 className="text-2xl font-semibold text-custom text-center mb-4">Register</h1>
        
        {/* Menggunakan styled-components untuk teks */}
        <TextCustom>Create a new account</TextCustom>

        <form onSubmit={registerUser}>
          <div className="mb-4">
            <Label htmlFor="name">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Confirm your password"
            />
          </div>

          {errorMessage && (
            <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {/* Menggunakan styled-components untuk tombol Register */}
          <RegisterButton type="submit">
            REGISTER
          </RegisterButton>
        </form>
        <div className="mt-2 text-center">
          <p className="text-sm text-custom">
            Already have an account?{" "}
            <a href="/login" className="text-custom hover:underline">
              LOG IN
            </a>
          </p>
        </div>
      </FormContainer>
    </RegisterContainer>
  );
};

export default RegisterPage;
