import { Link } from "react-router-dom";

const Top = () => {
  return (
    <div className="top">
      <h1>Top</h1>
      <Link to="/show-all-furniture">Go to Show All Furniture{"\n"}</Link>
      <Link to="/assemble-furniture">Go to Assemble Furniture{"\n"}</Link>
      <Link to="/make-furniture">Go to Make Furniture{"\n"}</Link>
      <h1>Login</h1>
      <Link to="/login">Go to Login</Link>
      <h1>SignUp</h1>
      <Link to="/signup">Go to Sign Up</Link>
    </div>
  );
};

export default Top;
