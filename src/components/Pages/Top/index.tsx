import { Link } from "react-router-dom";
import styles from "./index.module.css";
const Top = () => {
  return (
    <div>
      <h1>TopPage</h1>
      <div className={styles["top-links"]}>
        <Link to="/show-all-furniture">Go to Show All Furniture{"\n"}</Link>
        <Link to="/assemble-furniture">Go to Assemble Furniture{"\n"}</Link>
        <Link to="/make-furniture">Go to Make Furniture{"\n"}</Link>
      </div>
      <h1>Login/Signup</h1>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default Top;
