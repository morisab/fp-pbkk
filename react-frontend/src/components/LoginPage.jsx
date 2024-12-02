import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

// Global Style for font size
const GlobalStyle = createGlobalStyle`
  :root {
    --font-size: 18px;  /* Global font size */
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('/images/Login-Register.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-size: var(--font-size); /* Apply global font size */
`;

const LoginBox = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  border: 2px solid red; /* Red border added */
`;

const LoginLeft = styled.div`
  width: 100%;
  padding: 40px;
  background-color: #fcfafa;
  border-radius: 8px;
`;

const LoginTitle = styled.h1`
  font-size: 32px; 
  font-weight: 600;
  text-align: center;
  color: #0b3d3e;
  margin-bottom: 16px;
`;

const LoginInstruction = styled.p`
  font-size: 18px; /* Specific font size */
  color: #ff0303; /* Text color */
  text-align: center; /* Centered text */
  margin: 20px 0; /* Margin for spacing */
  font-weight: 500; /* Medium font weight */
  font-style: italic; /* Italic style */
`;

const FormLabel = styled.label`
  font-size: 18px;
  color: #0b3d3e;
  font-weight: 600;
  display: block; 
  margin-bottom: 8px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #006400;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 15px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #228b22;
    box-shadow: 0 0 5px rgba(34, 139, 34, 0.6);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #f70c0c;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: var(--font-size);

  &:hover {
    background-color: #a61616;
  }
`;

const ErrorMessage = styled.div`
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
  
      const { token, userID, isAdmin, name } = response.data;
  
      // Simpan data ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userID);
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("name", name);
  
      // Redirect berdasarkan isAdmin
      if (isAdmin === 1) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };  

  return (
    <>
      <GlobalStyle />
      <LoginContainer>
        <LoginBox>
          <LoginLeft>
            <LoginTitle>Login</LoginTitle>
            <LoginInstruction>Please log in to your account</LoginInstruction>

            <form onSubmit={loginUser}>
              <div className="mb-4">
                <FormLabel htmlFor="email">Email</FormLabel>
                <InputField
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
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                />
              </div>

              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

              <SubmitBtn type="submit" disabled={loading}>
                {loading ? "Logging in..." : "LOGIN"}
              </SubmitBtn>
            </form>
            <div className="mt-2 text-center">
              <p>
                Don't have an account?{" "}
                <a href="/register" className="text-custom hover:underline">
                  REGISTER
                </a>
              </p>
            </div>
          </LoginLeft>
        </LoginBox>
      </LoginContainer>
    </>
  );
};

export default LoginPage;