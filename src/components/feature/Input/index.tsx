import styles from "./index.module.css";

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input className={styles["myinput"]} {...props} />;
};

export default TextInput;
