import { useState } from "react";
import supabase from "../../../util/supabase";
import styles from "./index.module.css";
import TextInput from "../Input";
type Mode = "login" | "signup";
const AuthForm = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else setMessage("ログイン成功");
    setLoading(false);
  };
  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。",
      );
    }
    setLoading(false);
  };
  const handleSubmit = () => {
    if (mode === "login") handleLogin();
    else handleSignUp();
  };

  return (
    <div className={styles["auth-form"]}>
      <h2>{mode === "login" ? "ログイン" : "サインアップ"}</h2>
      <div className={styles["form-container"]}>
        {mode === "signup" && (
          <TextInput
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <TextInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "処理中..." : mode === "login" ? "Login" : "Sign Up"}
        </button>
      </div>
      {mode === "login" ? (
        <>
          <div className={styles["signup-text"]}>
            ログインがまだの方はサインアップ
          </div>
          <button
            onClick={() => {
              setMode("signup");
              setError("");
              setMessage("");
            }}
          >
            サインアップ
          </button>
        </>
      ) : (
        <>
          <div className={styles["signup-text"]}>
            　すでにアカウントをお持ちの方はログイン
          </div>
          <button
            onClick={() => {
              setMode("login");
              setError("");
              setMessage("");
            }}
          >
            ログインに戻る
          </button>
        </>
      )}
    </div>
  );
};

export default AuthForm;
