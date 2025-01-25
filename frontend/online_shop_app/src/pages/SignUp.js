import { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
 const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);

  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);

  const [state, setState] = useState("");
  const [stateError, setStateError] = useState(false);

  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState(false);

  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState(false);

  const [userRole, setRole] = useState("");
  const [roleError, setRoleError] = useState(false);

  const [apiError, setApiError] = useState(null); // To handle API errors

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
  const validatePincode = (pin) => /^[0-9]{6}$/.test(pin);

  const handleSubmit = async (event) => {
  event.preventDefault();

  // Reset errors before validating
  setNameError(false);
  setMobileError(false);
  setEmailError(false);
  setAddressError(false);
  setCityError(false);
  setStateError(false);
  setPincodeError(false);
  setPassError(false);
  setRoleError(false);

  // Perform validation
  const nameValid = name.length >= 3;
  const mobileValid = validateMobile(mobileNumber);
  const emailValid = validateEmail(email);
  const addressValid = address.length >= 5;
  const cityValid = city.length >= 3;
  const stateValid = state.length >= 3;
  const pincodeValid = validatePincode(pincode);
  const passwordValid = password.length >= 6;
  const roleValid = userRole !== "SELECT";

  // Update error states
  setNameError(!nameValid);
  setMobileError(!mobileValid);
  setEmailError(!emailValid);
  setAddressError(!addressValid);
  setCityError(!cityValid);
  setStateError(!stateValid);
  setPincodeError(!pincodeValid);
  setPassError(!passwordValid);
  setRoleError(!roleValid);

  // Proceed only if all validations pass
  if (nameValid && mobileValid && emailValid && addressValid && cityValid && stateValid && pincodeValid && passwordValid && roleValid) {
    const userData = {
      username: name,
      mobileNumber,
      email,
      address,
      city,
      state,
      pincode,
      password,
      role: userRole,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", userData);
      console.log("Response:", response.data);

      // Save to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("id", response.data.id);

      alert("User registered successfully!");

      // Navigate based on role
      if (response.data.role === "USER") {
        navigate("/user", { state: { userData } });
      } else if (response.data.role === "ADMIN") {
        navigate("/admin", { state: { userData } });
      }
    } catch (error) {
      console.error("API Error:", error);
      setApiError("Failed to register. Please try again.");
    }
  } else {
    alert("Please correct the errors before submitting.");
  }
};


  return (
    <div>
         <nav style={{backgroundColor:"black",padding:"15px", display:"flex", justifyContent:"flex-end",height:"70px"}}>
            <h3 style={{color:"white", position:"sticky", right:"1000px"}}>Mobile Shoppy</h3>
            {/* <Link to="/" style={{color:"white", fontSize:"20px",textDecoration:"none", marginLeft:"20px"}}>Home</Link> */}
            <Link to="/signIn" style={{color:"white", fontSize:"20px",textDecoration:"none",marginLeft:"20px"}}><button style={{border:"0px", backgroundColor:"red",padding:"5px",borderRadius:"10px",height:"40px",color:"white"}}>Sign In</button></Link>
            <Link to="/signUp" style={{color:"white", fontSize:"20px",textDecoration:"none",marginLeft:"20px"}}><button style={{border:"0px", backgroundColor:"red",padding:"5px",borderRadius:"10px",height:"40px",color:"white"}}>Sign Up</button></Link>
        </nav>
      <form onSubmit={handleSubmit} style={main}>
        <center><h2>Registration Form</h2></center><br/>

        <label><b>Name</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </label>
        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(e.target.value.length < 3);
          }}
        />
        {nameError && <p style={{ fontSize: "10px", color: "red" }}>Name must be at least 3 characters long</p>}

        
        &nbsp;&nbsp;&nbsp;<label><b>Mobile Number</b>: </label>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => {
            setMobileNumber(e.target.value);
            setMobileError(!validateMobile(e.target.value));
          }}
        />
        {mobileError && <p style={{ fontSize: "10px", color: "red" }}>Please enter a valid 10-digit mobile number</p>}

        <br /><br />

        <label><b>Email</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </label>
        <input
          type="text"
          placeholder="ex. xyz@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(!validateEmail(e.target.value));
          }}
        />
        {emailError && <p style={{ fontSize: "10px", color: "red" }}>Please enter a valid email</p>}



        &nbsp;&nbsp;&nbsp;<label><b>Address</b> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: </label>
<input
  type="text"
  placeholder="Enter Address"
  value={address}
  onChange={(e) => {
    setAddress(e.target.value);
    setAddressError(e.target.value.length < 5);
  }}
/>
{addressError && <p style={{ fontSize: "10px", color: "red" }}>Address must be at least 5 characters long</p>}

<br /><br />
<label><b>City</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </label>
        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setCityError(e.target.value.length < 3);
          }}
        />
        {cityError && <p style={{ fontSize: "10px", color: "red" }}>City must be at least 3 characters long</p>}

      

        &nbsp;&nbsp;&nbsp;   <label><b>State</b> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;: </label>
        <input
          type="text"
          placeholder="Enter State"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setStateError(e.target.value.length < 3);
          }}
        />
        {stateError && <p style={{ fontSize: "10px", color: "red" }}>State must be at least 3 characters long</p>}

<br /><br />

<label><b>Pincode</b>&nbsp;&nbsp;&nbsp;&nbsp;: </label>
<input
  type="text"
  placeholder="Enter Pincode"
  value={pincode}
  onChange={(e) => {
    setPincode(e.target.value);
    setPincodeError(!validatePincode(e.target.value));
  }}
/>
{pincodeError && <p style={{ fontSize: "10px", color: "red" }}>Please enter a valid 6-digit pincode</p>}


&nbsp;&nbsp;&nbsp;<label><b>Password</b> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;: </label>
        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPassError(e.target.value.length < 6);
          }}
        />
        {passError && <p style={{ fontSize: "10px", color: "red" }}>Password must be at least 6 characters long</p>}

        <br /><br />

        <label><b>User Role</b>&nbsp;: </label>
        <select
          value={userRole}
          onChange={(e) => {
            setRole(e.target.value);
            setRoleError(e.target.value === "SELECT");
          }}
        >
          <option>SELECT</option>
          <option>USER</option>
          <option>ADMIN</option>
        </select>
        {roleError && <p style={{ fontSize: "10px", color: "red" }}>Please select a valid role</p>}

        <br /><br />

        {apiError && <p style={{ fontSize: "12px", color: "red" }}>{apiError}</p>}

        <center>
          <button
            type="submit"
            style={{ height: "40px", width: "150px", backgroundColor: "black", color: "white", border: "0px", borderRadius: "10px" }}
          >
            Save
          </button>
          <br /><br />
          <p>If Already Register Then Login <Link to="/signIn" style={{color:"white", fontSize:"20px",textDecoration:"none",marginLeft:"20px"}}><button style={{border:"0px", backgroundColor:"red",padding:"5px",borderRadius:"10px",height:"40px",color:"white"}}>Sign In</button></Link>
          </p>
          </center>
      </form>

      {/* <center><h1 style={{marginTop:"60px", marginBottom:"50px"}}>Products</h1></center> */}

<footer className="footer" style={{ backgroundColor: "#333", padding: "20px", color: "white", marginTop:"30px" }}>
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

export default SignUp;

const main = {
  width: "800px",
  border: "1px solid black",
  margin: "auto",
  padding: "20px",
  fontSize: "20px",
  borderRadius: "10px",
  position: "relative",
  top: "20px",
};
