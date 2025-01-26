import React, { useState, useEffect } from "react";
import axios from "axios";

import { Link, useNavigate, NavLink } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/orders/history/${userId}`);
      setOrders(response.data); // Assuming response.data is an array of orders
      setError(null);
    } catch (err) {
      setError("Failed to fetch order history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/orders/${orderId}/cancel`); // Backend endpoint to cancel the order
      alert('Order canceled successfully!');
      fetchOrders(); // Refresh the orders list after cancellation
    } catch (err) {
      alert('Failed to cancel the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
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
          <h1 style={{ color: "white", marginLeft: "20px", fontSize: "20px" }}>Welcome, {username}</h1>
          <Link to="/logOut" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>
            <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>Log Out</button>
          </Link>
        </div>
      </nav>
    <div style={{ width: "80%", margin: "0 auto", marginTop: "20px" }}>
      <center><h2>Your Order History</h2></center>

      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Order ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Price</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Quantity</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Price</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Order Date</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th> {/* New column for action */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                {order.items.map((item) => (
                  <tr key={item.productId}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.id}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.productName}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>Rs.{item.price}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.quantity}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      Rs.{item.price * item.quantity}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {order.status} {/* Displaying status */}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {order.status === "PENDING" && ( // Only allow cancellation for PENDING orders
                        <button
                          style={{ padding: "5px 10px", backgroundColor: "red", color: "white", borderRadius: "5px" }}
                          onClick={() => cancelOrder(order.id)} // Cancel order button
                        >
                          Cancel Order
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
    <footer className="footer" style={{ backgroundColor: "#333", padding: "20px", color: "white" , marginTop:"30px"}}>
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

export default OrderHistory;
