import styles from "./styles/profile.module.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <img
            src="/logo.jpg"
            alt="SRMIST Logo"
            className={styles.logo}
            onClick={() => navigate("/")}
          />
          <h2>SRMIST Lost & Found</h2>

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.row}>
            <h3>Username</h3>
            <p>.....</p>
          </div>

          <div className={styles.row}>
            <h3>Email</h3>
            <p>.....</p>
          </div>

          <div className={styles.actions}>
            <button onClick={() => navigate("/lost")}>Lost</button>
            <button onClick={() => navigate("/found")}>Found</button>
          </div>
        </div>
      </main>
    </>
  );
}
