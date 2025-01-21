import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const PlaceOrder = () => {
  const navigate = useNavigate();
  const userId=localStorage.getItem("id");
  const username=localStorage.getItem("username") || "Guest";
  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/orders/place/${userId}`);
      alert("Order placed successfully!");
      navigate("/orders/history");
    } catch (error) {
      alert("Error placing order: " + error.response.data.message);
    }
  };

  return (
    <div style={{width:"1270px"}}>
       <nav style={{ backgroundColor: "black", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "70px", width: "1270px" }}>
        <h3 style={{color:"white"}}>Online Shoppy</h3>
        <div style={{ display: "flex", justifyContent: "space-around", flexGrow: 1 }}>
          <Link to="/user/products" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>Products</Link>
          <Link to="/orders/history" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>My Orders</Link>
          <Link to="/cart" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>My Cart</Link>
          <h1 style={{ color: "white", marginLeft: "20px", fontSize:"20px" }}>Welcome, {username}</h1>
          <Link to="/logOut" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>
            <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>Log Out</button>
          </Link>
        </div>
      </nav>
      <h2>Place Order</h2>
      <button onClick={handlePlaceOrder}>Confirm Order</button>
    </div>
  );
};

export default PlaceOrder;
