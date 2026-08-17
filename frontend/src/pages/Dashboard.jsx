import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const API_URL = "https://ecoavenger.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      // Token nahi hai → Login page
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.detail || "Failed to load profile");
        }

        setUser(data);
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Loading
  if (loading) {
    return <div className={styles.loading}>Loading Dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <h2>🌱 EcoAvenger</h2>

        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </nav>

      <main className={styles.container}>
        <div className={styles.welcomeCard}>
          <div>
            <p>WELCOME BACK 👋</p>

            <h1>Hello, {user?.name || "Avenger"}!</h1>

            <span>Let's make our planet cleaner and greener 🌍</span>
          </div>

          <div className={styles.avatar}>🌱</div>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.icon}>⭐</div>

            <p>Eco Points</p>

            <h2>{user?.points ?? 0}</h2>

            <span>Keep earning!</span>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>♻️</div>

            <p>Plastic Collected</p>

            <h2>0</h2>

            <span>Start recycling</span>
          </div>

          <div className={styles.card}>
            <div className={styles.icon}>🎁</div>

            <p>Rewards</p>

            <h2>{Math.floor((user?.points ?? 0) / 250)}</h2>

            <span>Available rewards</span>
          </div>
        </div>

        <div className={styles.actionCard}>
          <h2>♻️ Submit Plastic</h2>

          <p>Upload plastic waste and earn Eco Points.</p>

          <button onClick={() => navigate("/detect")}>📷 Submit Plastic</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
