import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const API_URL = "https://ecoavenger.onrender.com";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("Login Response:", data);

      // API error
      if (!response.ok) {
        let errorMessage = "Login failed";

        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((error) => error.msg).join(", ");
        }

        throw new Error(errorMessage);
      }

      // JWT token save
      localStorage.setItem("access_token", data.access_token);

      // Optional: user data save if backend sends it
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert("Login successful!");

      // Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          🌱 <span>Eco</span> Avengers
        </div>

        {/* Heading */}
        <h1>Welcome Back!</h1>

        <p className={styles.subtitle}>
          Login and continue your environmental journey.
        </p>

        {/* Error */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.inputGroup}>
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Options */}
          <div className={styles.options}>
            <label className={styles.remember}>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          {/* Login */}
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className={styles.bottomText}>
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
