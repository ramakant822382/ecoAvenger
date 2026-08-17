import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        🌱 <span>Eco</span> Enovenger
      </Link>

      {/* Desktop / Mobile Links */}
      <div className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
        <Link to="/" className={styles.navLink} onClick={closeMenu}>
          Home
        </Link>

        <a href="#about" onClick={closeMenu}>
          About
        </a>

        <Link to="/dashboard" onClick={closeMenu}>
          Dashboard
        </Link>

        <a href="#leaderboard" onClick={closeMenu}>
          Leaderboard
        </a>

        {/* Mobile Buttons */}
        <div className={styles.mobileActions}>
          <Link to="/login" className={styles.loginBtn} onClick={closeMenu}>
            Login
          </Link>

          <Link to="/register" className={styles.signupBtn} onClick={closeMenu}>
            Join Us
          </Link>
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className={styles.navActions}>
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>

        <Link to="/register" className={styles.signupBtn}>
          Join Us
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className={`${styles.menuBtn} ${menuOpen ? styles.menuOpen : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
};

export default Navbar;
