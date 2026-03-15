import { Link } from "react-router-dom";
import AuthForm from "../../feature/LoginForm";
import "./Login.css";
const Login = () => {
  return (
    <div className="Title">
      <h1>Login/Signup</h1>
      <div className="link">
        <AuthForm />
        <Link to="/">トップページはこちらから</Link>
      </div>
    </div>
  );
};

export default Login;
