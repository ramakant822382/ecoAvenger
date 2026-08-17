import React from "react";
import styles from "./Home.module.css";
import heroImage from "../assets/home.jpeg";

const Home = () => {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        {/* Left Content */}
        <div className={styles.leftContent}>
          <div className={styles.logo}>
            <span className={styles.logoLeaf}>◢</span>
            <span>Enovenger</span>
          </div>

          <div className={styles.heading}>
            <h1>
              Every Citizen.
              <br />
              Every Action.
              <br />
              A Cleaner
              <br />
              Nation.
            </h1>

            <div className={styles.line}></div>

            <p>
              A gamified mobile platform turning everyday
              <br className={styles.desktopBreak} />
              waste collection into real rewards — mobilizing
              <br className={styles.desktopBreak} />
              citizens to become environmental heroes.
            </p>
          </div>

          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Get Started</button>

            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>

        {/* Right Image */}
        <div className={styles.rightImage}>
          <img src={heroImage} alt="Enovenger environmental world" />
        </div>

        {/* Decorative Leaves */}
        <div className={`${styles.leaf} ${styles.leafOne}`}>🍃</div>
        <div className={`${styles.leaf} ${styles.leafTwo}`}>🍃</div>
        <div className={`${styles.leaf} ${styles.leafThree}`}>🍃</div>
      </section>
    </main>
  );
};

export default Home;
