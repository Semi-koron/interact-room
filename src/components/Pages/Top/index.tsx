import { Link } from "react-router-dom";
import styles from "./index.module.css";
const Top = () => {
  return (
    <div>
      <div className={styles["top-page"]}>
        <h1>-家具を作る</h1>
        <div className={styles["top-explain"]}>
          みんなで協力して家具を作ろう！
        </div>
        <Link to="/make-furniture" className={styles["top-links"]}>
          家具を作る
        </Link>
        <h1>-あなたが所有している家具</h1>
        <div className={styles["top-explain"]}>作った家具を確認しよう！</div>
        <Link to="/show-all-furniture" className={styles["top-links"]}>
          家具を確認する
        </Link>
        <h1>-家具を配置する</h1>
        <div className={styles["top-explain"]}>
          作った家具を自由に配置して自分だけの部屋を作ろう！
        </div>
        <Link to="/assemble-furniture" className={styles["top-links"]}>
          家具を配置する
        </Link>

        <Link to="/game/aaa" className={styles["top-links"]}>
          デバック用
        </Link>
      </div>
    </div>
  );
};

export default Top;
