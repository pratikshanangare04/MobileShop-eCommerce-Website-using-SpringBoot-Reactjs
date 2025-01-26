import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
  const navigate = useNavigate();
  const username=localStorage.getItem("username") || "Guest";

 

  // Assuming user data is stored in localStorage
  const currentUser = {
    id: localStorage.getItem("id"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    mobileNumber: localStorage.getItem("mobileNumber"),
    address: localStorage.getItem("address"),
    city: localStorage.getItem("city"),
    state: localStorage.getItem("state"),
    pincode: localStorage.getItem("pincode"),
    role: localStorage.getItem("role"),
  };

  const [name, setName] = useState(currentUser.username || "");
  const [nameError, setNameError] = useState(false);

  const [mobileNumber, setMobileNumber] = useState(currentUser.mobileNumber || "");
  const [mobileError, setMobileError] = useState(false);

  const [email, setEmail] = useState(currentUser.email || "");
  const [emailError, setEmailError] = useState(false);

  const [address, setAddress] = useState(currentUser.address || "");
  const [addressError, setAddressError] = useState(false);

  const [city, setCity] = useState(currentUser.city || "");
  const [cityError, setCityError] = useState(false);

  const [state, setState] = useState(currentUser.state || "");
  const [stateError, setStateError] = useState(false);

  const [pincode, setPincode] = useState(currentUser.pincode || "");
  const [pincodeError, setPincodeError] = useState(false);

  const [password, setPassword] = useState(currentUser.password);
  const [passError, setPassError] = useState(false);

  const [userRole, setRole] = useState(currentUser.role || "");
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

      const userId=currentUser.id;
      try {
        const response = await axios.patch(`http://localhost:8080/api/auth/update/${userId}`, userData);
        console.log("Response:", response.data);

        // Save updated data to localStorage
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("id", response.data.id);

        alert("User updated successfully!");
      } catch (error) {
        console.error("API Error:", error);
        setApiError("Failed to update. Please try again.");
      }
    } else {
      alert("Please correct the errors before submitting.");
    }
  };

  return (
    <div>
    <nav style={{backgroundColor:"black",padding:"15px", display:"flex", justifyContent:"flex-end",height:"70px"}}>
       <h3 style={{color:"white", position:"sticky", right:"1000px"}}>Mobile Shoppy</h3>
   <div style={{ display: "flex", justifyContent: "space-around", flexGrow: 1 }}>
    <Link to="/user/products" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>Products</Link>
     <Link to="/orders/history" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>My Orders</Link>
     <Link to="/cart" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>My Cart</Link>
     <Link to="/user/update-profile" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>User</Link>
     <h1 style={{ color: "white", fontSize:"20px" }}>Welcome, {username}</h1>
   </div>
 <Link to="/logOut" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>
       <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>Log Out</button>
 </Link>
 </nav>
      <form onSubmit={handleSubmit} style={main}>
        <center><h2>Update User Information</h2></center><br />

        {/* Form fields */}
        <label><b>Name</b>: </label>
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

        <label><b>Mobile Number</b>: </label>
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

        <label><b>Email</b>: </label>
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

        <label><b>Address</b>: </label>
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

        <label><b>City</b>: </label>
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

        <label><b>State</b>: </label>
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

        <label><b>Pincode</b>: </label>
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            setPincode(e.target.value.length < 6);
          }}
        />
         {pincodeError && <p style={{ fontSize: "10px", color: "red" }}>Pincode must be at least 6 characters long</p>}

         <label><b>Password</b>: </label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPassError(e.target.value.length < 6);
          }}
        />
         {passError && <p style={{ fontSize: "10px", color: "red" }}>Password must be contains least 1 upper, 1 Lower,1 digit</p>}
          <br/>

          <label><b>Role</b>: </label>
        <input
          type="text"
          placeholder="Enter Role"
          value={userRole}
          onChange={(e) => {
            setRole(e.target.value);
            setRoleError(e.target.value.length =='');
          }}
        />
         {roleError && <p style={{ fontSize: "10px", color: "red" }}>Incorrect </p>}

        <center><button
          type="submit"
          style={{ height: "40px", width: "150px", backgroundColor: "black", color: "white", border: "0px", borderRadius: "10px" }}
        >
          Update
        </button></center>
        {apiError && <p style={{ fontSize: "12px", color: "red" }}>{apiError}</p>}
      </form>

      {/* Footer Section */}
      <footer className="footer" style={{ backgroundColor: "#333", padding: "20px", color: "white", marginTop: "30px" }}>
        <div className="footer-info" style={{ textAlign: "center" }}>
          <p style={{ margin: "0", fontSize: "14px" }}>&copy; 2025 Mobile Shoppy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UpdateUser;

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
