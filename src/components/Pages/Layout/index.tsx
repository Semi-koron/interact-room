import { Outlet } from "react-router-dom";
import styles from "./index.module.css";
import { Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles["header-title"]}>
          素晴らしいタイトル
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
  );
};

export default Layout;
