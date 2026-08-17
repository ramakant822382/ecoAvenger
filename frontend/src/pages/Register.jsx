import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const API_URL = "https://ecoavenger.onrender.com";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Register user
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("Register Response:", data);

      // API error
      if (!response.ok) {
        let errorMessage = "Registration failed";

        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((error) => error.msg).join(", ");
        }

        throw new Error(errorMessage);
      }

      // Registration successful
      alert("Registration successful! Please login.");

      // Login page par redirect
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

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
        <h1>Join Eco Avengers</h1>

        <p className={styles.subtitle}>
          Create your account and start saving the planet.
        </p>

        {/* Error Message */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className={styles.inputGroup}>
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {/* Terms */}
          <label className={styles.terms}>
            <input type="checkbox" required />

            <span>
              I agree to the <a href="/terms">Terms & Conditions</a>
            </span>
          </label>

          {/* Register Button */}
          <button
            type="submit"
            className={styles.registerBtn}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Login */}
        <p className={styles.bottomText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
