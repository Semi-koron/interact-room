import { Outlet } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <div>
        <header className={styles.header}>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap"
            rel="stylesheet"
          />
          <Link to="/" className={styles["header-title"]}>
            カグログ
          </Link>

          <div className={styles["to-login"]}>
            <Link to="/login" className={styles["bottun"]}>
              ログイン
              <br />
              新規登録
            </Link>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
