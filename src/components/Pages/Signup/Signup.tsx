import { Link } from "react-router-dom";
import AuthForm from "../../feature/LoginForm";

const Signup = () => {
  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <Link to="/">Go to Top</Link>
      <AuthForm />
    </div>
  );
};

export default Signup;
