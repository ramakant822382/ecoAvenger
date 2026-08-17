import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        🌱 <span>Eco</span> Enovenger
      </div>

      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>
          Home
        </Link>
        <a href="#about">About</a>
        <Link to="/dashboard">Dashboard</Link>
        <a href="#leaderboard">Leaderboard</a>
      </div>

      <div className={styles.navActions}>
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>

        <Link to="/register" className={styles.signupBtn}>
          Join Us
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
