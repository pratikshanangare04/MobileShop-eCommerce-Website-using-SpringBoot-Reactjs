import { Link, useLocation,NavLink} from "react-router-dom";
import Signimage from "../images/signin.jpeg";
import MobileImage from "../images/mobile1.png";
import image1 from "../images/OnePlus1.webp";
import image2 from "../images/realme1.jpg";
import image3 from "../images/samsang1.webp";
import image4 from "../images/iq1.jpg";
import image5 from "../images/honor.webp";
import DisplayPage from "../pages/DisplayPage";
import { useState } from "react";
import axios from "axios";
import SearchResult from "./SearchResult";


const UserDashboard = () => {
    const location = useLocation();
    const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
    const userData = location.state?.userData || JSON.parse(localStorage.getItem("userData"));;  // Accessing the passed state
  
    console.log(location.state); 
    if (!userData) {
      return <div>No user data available!</div>;  // Handle case when no data is passed
    }
    console.log(userData);
    // If userData is not available, set username to "Guest"
    // const username = userData?.username || "Guest"; 
    const userId=localStorage.getItem("id");
  const username=localStorage.getItem("username") || "Guest";

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a product name.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/products/search`, {
        params: { name: query },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
        <div><input
            style={{ marginLeft: "20px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
            type="text"
            placeholder="Enter product name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
      <button onClick={handleSearch} style={{margin:"2px", padding:"5px", borderRadius:"10px"}}>Search</button></div>
      <Link to="/logOut" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>
            <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>Log Out</button>
      </Link>
      </nav>

      {/* Products Section */}
      {/* <center><h1 style={{ marginTop: "50px", marginBottom: "50px" }}>Products</h1></center> */}
      {results.length > 0 && <SearchResult results={results} />} {/* Use SearchResult component */}

      {/* Products Section */}
      {results.length === 0 && (
        <div>
          <center>
            <h1 style={{ marginTop: "50px", marginBottom: "50px" }}>Products</h1>
          </center>
          <DisplayPage />
        </div>
      )}

      <footer className="footer" style={{ backgroundColor: "#333", padding: "20px", color: "white" }}>
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
}

export default UserDashboard;

