import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";

const API_URL = "https://ecoavenger.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);

  // ===============================
  // FETCH PROFILE
  // ===============================
  const fetchProfile = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Profile Response:", data);

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch profile");
      }

      setUser(data);
    } catch (error) {
      console.error("Profile Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // INITIAL PROFILE LOAD
  // ===============================
  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  // ===============================
  // IMAGE UPLOAD + AI DETECTION
  // ===============================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Only images
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    try {
      setUploading(true);
      setDetectionResult(null);

      const formData = new FormData();

      formData.append("file", file);

      console.log("Uploading image:", file.name);

      const response = await fetch(`${API_URL}/plastic/detect`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const data = await response.json();

      console.log("AI Detection Response:", data);

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || "Plastic detection failed");
      }

      // Save detection result
      setDetectionResult(data);

      /*
        Example response:

        {
          prediction: "a plastic bottle",
          confidence: 91.4,
          points: 10
        }
      */

      // Refresh profile
      await fetchProfile();
    } catch (error) {
      console.error("Plastic Detection Error:", error);

      alert(error.message || "Unable to detect plastic.");
    } finally {
      setUploading(false);

      // Same image dobara select karne ke liye
      e.target.value = "";
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>

        <p>Loading your Eco Dashboard...</p>
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================
  if (error) {
    return (
      <div className={styles.errorPage}>
        <h2>Something went wrong 😕</h2>

        <p>{error}</p>

        <button
          onClick={() => window.location.reload()}
          className={styles.submitBtn}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ===============================
  // USER DATA
  // ===============================
  const points = user?.points || 0;

  const rewardPoints = 250;

  const progress = Math.min((points / rewardPoints) * 100, 100);

  const pointsLeft = Math.max(rewardPoints - points, 0);

  // ===============================
  // UI
  // ===============================
  return (
    <div className={styles.dashboard}>
      {/* ================= WELCOME ================= */}

      <section className={styles.welcome}>
        <div>
          <p className={styles.smallTitle}>WELCOME BACK, AVENGER 👋</p>

          <h1>Keep Saving the Planet!</h1>

          <p className={styles.description}>
            Every piece of plastic you collect brings us one step closer to a
            cleaner and greener world.
          </p>

          <p className={styles.userName}>
            Hello, <strong>{user?.name}</strong> 🌱
          </p>
        </div>

        <div className={styles.avatar}>🌱</div>
      </section>

      {/* ================= STATS ================= */}

      <section className={styles.statsGrid}>
        {/* Plastic */}

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.greenIcon}`}>♻️</div>

          <div>
            <p>Total Plastic</p>

            <h2>0 KG</h2>

            <span>Collected so far</span>
          </div>
        </div>

        {/* Points */}

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.yellowIcon}`}>⭐</div>

          <div>
            <p>Eco Points</p>

            <h2>{points}</h2>

            <span>Keep earning!</span>
          </div>
        </div>

        {/* Rank */}

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.blueIcon}`}>🏆</div>

          <div>
            <p>Your Rank</p>

            <h2>--</h2>

            <span>Among Eco Avengers</span>
          </div>
        </div>

        {/* Rewards */}

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.purpleIcon}`}>🎁</div>

          <div>
            <p>Rewards</p>

            <h2>{Math.floor(points / 250)}</h2>

            <span>Available rewards</span>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <section className={styles.contentGrid}>
        {/* ================= SUBMIT PLASTIC ================= */}

        <div className={styles.submitCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Submit Plastic</h2>

              <p>Turn your plastic waste into Eco Points.</p>
            </div>

            <span className={styles.recycleIcon}>♻️</span>
          </div>

          <div className={styles.uploadBox}>
            <div className={styles.uploadIcon}>📦</div>

            <h3>Submit your plastic</h3>

            <p>Upload a photo of the plastic you collected.</p>

            {/* HIDDEN FILE INPUT */}

            <input
              type="file"
              accept="image/*"
              id="plasticImage"
              className={styles.fileInput}
              onChange={handleImageUpload}
            />

            {/* UPLOAD BUTTON */}

            <label htmlFor="plasticImage" className={styles.submitBtn}>
              {uploading ? "🔍 Detecting..." : "📷 Upload Plastic Image"}
            </label>

            {/* ================= RESULT ================= */}

            {detectionResult && (
              <div className={styles.detectionResult}>
                <h3>♻️ AI Detection Result</h3>

                <p>
                  <strong>Detected:</strong> {detectionResult.prediction}
                </p>

                <p>
                  <strong>Confidence:</strong> {detectionResult.confidence}%
                </p>

                <p className={styles.earnedPoints}>
                  ⭐ +{detectionResult.points} Eco Points
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= REWARD ================= */}

        <div className={styles.progressCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Next Reward</h2>

              <p>
                {points >= rewardPoints
                  ? "Reward unlocked! 🎉"
                  : "You're almost there!"}
              </p>
            </div>

            <span className={styles.rewardIcon}>🎁</span>
          </div>

          <div className={styles.rewardInfo}>
            <div>
              <h3>Movie Ticket 🎬</h3>

              <p>{rewardPoints} points required</p>
            </div>

            <strong>
              {points} / {rewardPoints}
            </strong>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          <p className={styles.pointsLeft}>
            {points >= rewardPoints ? (
              <>
                🎉 <strong>Reward unlocked!</strong>
              </>
            ) : (
              <>
                Only <strong>{pointsLeft} points</strong> more to unlock!
              </>
            )}
          </p>
        </div>
      </section>

      {/* ================= BOTTOM ================= */}

      <section className={styles.bottomGrid}>
        {/* Recent Activity */}

        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Recent Activity</h2>

              <p>Your latest environmental contributions.</p>
            </div>

            <button className={styles.viewBtn}>View All</button>
          </div>

          <div className={styles.activityList}>
            {detectionResult ? (
              <div className={styles.activity}>
                <div className={styles.activityIcon}>♻️</div>

                <div className={styles.activityText}>
                  <h4>Plastic Submitted</h4>

                  <p>{detectionResult.prediction}</p>
                </div>

                <strong>+{detectionResult.points} pts</strong>
              </div>
            ) : (
              <div className={styles.activity}>
                <div className={styles.activityIcon}>🌱</div>

                <div className={styles.activityText}>
                  <h4>Welcome to Eco Avengers</h4>

                  <p>Start submitting plastic to earn points.</p>
                </div>

                <strong>🌱</strong>
              </div>
            )}
          </div>
        </div>

        {/* ================= LEADERBOARD ================= */}

        <div className={styles.leaderboardCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Leaderboard 🏆</h2>

              <p>Top Eco Avengers</p>
            </div>
          </div>

          <div className={styles.leaderList}>
            <div className={styles.leader}>
              <span className={styles.rank}>🥇</span>

              <span>Rahul</span>

              <strong>890 pts</strong>
            </div>

            <div className={styles.leader}>
              <span className={styles.rank}>🥈</span>

              <span>Priya</span>

              <strong>760 pts</strong>
            </div>

            <div className={styles.leader}>
              <span className={styles.rank}>🥉</span>

              <span>Aman</span>

              <strong>680 pts</strong>
            </div>

            {/* CURRENT USER */}

            <div className={`${styles.leader} ${styles.currentUser}`}>
              <span className={styles.rank}>--</span>

              <span>{user?.name || "You"}</span>

              <strong>{points} pts</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
