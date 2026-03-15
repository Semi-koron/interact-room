import { Link } from "react-router-dom";
import styles from "./index.module.css";
const Top = () => {
  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>素晴らしいタイトル</h1>
        <div className={styles["to-login"]}>
          <Link to="/login" className={styles["bottun"]}>
            　ログイン　
            <br />
            サインアップ
          </Link>
        </div>
      </header>
      <div className={styles["top-page"]}>
        <h1>TopPage</h1>
        <div className={styles["top-links"]}>
          <Link to="/show-all-furniture">Go to Show All Furniture{"\n"}</Link>
          <Link to="/assemble-furniture">Go to Assemble Furniture{"\n"}</Link>
          <Link to="/make-furniture">Go to Make Furniture{"\n"}</Link>
        </div>
      </div>
    </div>
  );
};

export default Top;
