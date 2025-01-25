import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, NavLink } from "react-router-dom";
import ProductPage from "./ProductPage";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input field change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Making API call for login
      const response = await axios.post("http://localhost:8080/api/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
  
      const resp= await axios.get(`http://localhost:8080/api/auth/${credentials.email}`,
        {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        }
      )
      console.log(resp.data)
      // Create a user data object
      const userData = {
        token: response.data.token,
        role: resp.data.role,
        username: resp.data.username,
        id:resp.data.id,
      };
  
      localStorage.setItem("token", resp.data.token);
      localStorage.setItem("role", resp.data.role);
      localStorage.setItem("username", resp.data.username);
      localStorage.setItem("id", resp.data.id);
      

      console.log(userData)
      alert("Login Successfully");

      // Navigate to the respective dashboard based on the role
      if (response.data.role === "USER") {
        navigate("/user", { state: { userData } });
      } else if (response.data.role === "ADMIN") {
        navigate("/admin", { state: { userData } });
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div>
         <nav style={{backgroundColor:"black",padding:"15px", display:"flex", justifyContent:"flex-end",height:"70px"}}>
            <h3 style={{color:"white", position:"sticky", right:"1000px"}}>Mobile Shoppy</h3>
        <Link to="/signIn" style={{ color: "white", fontSize: "20px", textDecoration: "none", marginLeft: "20px" }}>
          <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>
            Sign In
          </button>
        </Link>
        <Link to="/signUp" style={{ color: "white", fontSize: "20px", textDecoration: "none", marginLeft: "20px" }}>
          <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>
            Sign Up
          </button>
        </Link>
      </nav>

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{
        width: "400px", border: "1px solid black", margin: "auto", padding: "20px", fontSize: "20px", borderRadius: "10px", position: "relative", top: "50px",
      }}>
        <center>
          <h2>Login</h2>
          <input type="text" name="email" placeholder="Email" onChange={handleChange} required style={{ width: "300px" }} /><br /><br />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ width: "300px" }} /><br /><br />
          <button
            type="submit"
            style={{
              height: "40px", width: "150px", backgroundColor: "black", color: "white", border: "0px", borderRadius: "10px",
            }}
          >
            Login
          </button><br /><br />
          {error && <p>{error}</p>}
        </center>

        <center>
          <p>If Already Have an Account Then Register
            <Link to="/signUp" style={{ color: "white", fontSize: "20px", textDecoration: "none", marginLeft: "20px" }}>
              <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>
                Sign Up
              </button>
            </Link>
          </p>
        </center>
      </form>

      {/* Products Section */}
      {/* <center><h1 style={{ marginTop: "80px", marginBottom: "50px" }}>Products</h1></center>
      <ProductPage /> */}

<footer className="footer" style={{ backgroundColor: "#333", padding: "20px", color: "white" , marginTop:"80px"}}>
    <div className="footer-links" style={{ marginBottom: "20px" }}>
        <ul style={{ listStyle: "none", display: "flex", justifyContent: "center", padding: "0" }}>
            <li style={{ margin: "0 15px" }}>
                <NavLink to={"/"} style={{ textDecoration: "none", color: "white" }}>
                    About Us
                </NavLink>
            </li>
            <li style={{ margin: "0 15px" }}>
                <NavLink to={"/"} style={{ textDecoration: "none", color: "white" }}>
                    Contact Us
                </NavLink>
            </li>
            <li style={{ margin: "0 15px" }}>
                <NavLink to={"/"} style={{ textDecoration: "none", color: "white" }}>
                    Terms & Conditions
                </NavLink>
            </li>
            <li style={{ margin: "0 15px" }}>
                <NavLink to={"/"} style={{ textDecoration: "none", color: "white" }}>
                    Privacy Policy
                </NavLink>
            </li>
            <li style={{ margin: "0 15px" }}>
                <NavLink to={"/"} style={{ textDecoration: "none", color: "white" }}>
                    FAQs
                </NavLink>
            </li>
        </ul>
    </div>
    <div className="footer-info" style={{ textAlign: "center" }}>
        <p style={{ margin: "0", fontSize: "14px" }}>
            &copy; 2025 Mobile Shoppy. All rights reserved.
        </p>
    </div>
</footer>
    </div>
  );
};

export default Login;
