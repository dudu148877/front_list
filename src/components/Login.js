import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert, Container } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      const { token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("password", password);
      localStorage.setItem("name", Date.name);

      
      navigate("/dashboard");
    } catch (error) {
      alert("zzzzzzzzzzzzzzzzzz");
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "50px" }}>
      <Box
        sx={{
          padding: "20px",
          boxShadow: 3,
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >  
     
      
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        {errorMessage && (
          <Alert severity="error" style={{ marginBottom: "20px" }}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box marginBottom={2}>
            <TextField
              fullWidth
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginBottom: "10px" }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
