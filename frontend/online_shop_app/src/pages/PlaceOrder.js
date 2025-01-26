import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
   const [users, setUsers] = useState([]);
   const [orders, setOrders] = useState([]);
  const { cart, totalPrice, userId ,productId,quantity, selectedProduct} = location.state || {};
  const [error, setError] = useState(null);



  
  useEffect(()=>{
    fetchUser();
  },[]);
 
  const fetchUser = async () => {
    try {
        const userResponse = await axios.get(`http://localhost:8080/api/auth/id/${userId}`);
        setUsers(userResponse.data);
        console.log(userResponse.data)
      } catch (userError) {
            console.error("Error fetching user data:", userError);
          }
  };

  console.log(cart)
  const handlePlaceOrder = async () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Your cart is empty. Cannot place an order.");
      return;
  }

  try {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    // Place the order
    const response = await axios.post(`http://localhost:8080/api/orders/place/${userId}/${productId}`, null, { headers });

    setOrders(response.data);
   // await updateStockAndClearCart();
    
    alert("Order placed successfully! Pay on delivery.");
    navigate("/order/place/submit"); 

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    alert(`Error placing order: ${errorMessage}`);
  }

  };

  

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "50%", borderCollapse: "collapse", margin: "auto"}}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User ID</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{userId}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Email</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.email}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Name</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.username}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Address</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.address}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User City</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.city}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User State</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.state}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Pincode</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.pincode}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Mobile No.</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.mobileNumber}</td>
                </tr>

                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{users.role}</td>
                </tr>

                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Name</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{selectedProduct.name}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Name</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{selectedProduct.description}</td>
                </tr>
                 <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Price</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{selectedProduct.price}</td>
                </tr>
                 <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Discount</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{selectedProduct.discount}%</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Price After Discount</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{selectedProduct.discountPrice}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Quantity</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{quantity}</td>
                </tr>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Amount</th>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{totalPrice}</td>
                </tr>
      
            </thead>
        </table>

      <center><button
        onClick={handlePlaceOrder}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Place Order
      </button></center>
    </div>
  );
};

export default PlaceOrder;
