import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminProduct from "../pages/AdminProduct";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesReport, setSalesReport] = useState({ totalSales: 0, totalOrders: 0 });
  const [selectedSection, setSelectedSection] = useState("users"); 
  const [product, setProducts]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchSalesReport();
    fetchProduct();
  }, []);


  const fetchProduct=async()=>{
    axios.get("http://localhost:8080/api/products")
      .then(response => {
        setProducts(Array.isArray(response.data) ? response.data : response.data.products || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Failed to load products");
        setLoading(false);
      });
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders/getOrders");
      const ordersData = response.data;

      // Fetch user details based on userId in each order
      const updatedOrders = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const userId = order.userId;
            if (userId) {
              const userResponse = await axios.get(`http://localhost:8080/api/auth/id/${userId}`);
              return { ...order, userData: userResponse.data }; // Add user data if available
            } else {
              return { ...order, userData: null }; // Handle case if no userId is found
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            return { ...order, userData: null }; // In case of error, return order without userData
          }
        })
      );

      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/sales-report");
      setSalesReport(response.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/role`, null, {
        params: { role },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const updateOrderStatusToShipped = async (orderId) => {
    try {
      // Send PUT request to update the status to SHIPPED
      const response = await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status/shipped`
      );
      // If successful, update the orders list
      fetchOrders();
      alert("Order status updated to SHIPPED");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  // const handleDelete = (id) => {
  //   axios.delete(`http://localhost:8080/api/products/${id}`)
  //     .then(response => {
  //       setMessage(response.data);
  //       alert("Product Deleted Successfully")
  //     })
  //     .catch(error => {
  //       console.error('Error deleting product:', error);
  //     });
  // };
  const handleDelete = async (id) => {
    try {
      // Replace with your API endpoint
      const response = await fetch(`http://localhost:8080/api/products/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // If the deletion was successful, update the state
        const updatedProducts = product.filter(product => product.id !== id);
        setProducts(updatedProducts);
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete the product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting the product:', error);
      alert('An error occurred while deleting the product.');
    }
  };

  return (
    <div>
         <nav style={{backgroundColor:"black",padding:"15px", display:"flex", justifyContent:"flex-end",height:"70px"}}>
            <h3 style={{color:"white", position:"sticky", right:"1000px"}}>Mobile Shoppy</h3>
        <div style={{ display: "flex", justifyContent: "space-around", flexGrow: 1 }}>
          <button  onClick={() => setSelectedSection("product")}
            style={{ color: "white", fontSize: "20px", textDecoration: "none", background: "none", border: "none" }}
        >
            Products
          </button>
          <button
            onClick={() => setSelectedSection("addproduct")}
            style={{ color: "white", fontSize: "20px", textDecoration: "none", background: "none", border: "none" }}
          >
            Add Product
          </button>
          <button
            onClick={() => setSelectedSection("orders")}
            style={{ color: "white", fontSize: "20px", textDecoration: "none", background: "none", border: "none" }}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setSelectedSection("users")}
            style={{ color: "white", fontSize: "20px", textDecoration: "none", background: "none", border: "none" }}
          >
            Manage Users
          </button>
          <h1 style={{ color: "white", marginTop: "10px", fontSize: "20px" }}>Welcome, {username}</h1>
          <Link to="/logOut" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>
            <button
              style={{
                border: "0px",
                backgroundColor: "red",
                padding: "5px",
                borderRadius: "10px",
                height: "40px",
                color: "white",
              }}
            >
              Log Out
            </button>
          </Link>
        </div>
      </nav>

      {/* Conditional Rendering based on the selected section */}
      {selectedSection === "users" && (
        <section>
          <center>
            <h2>Manage Users</h2>
          </center>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Username</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Role</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.id}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.username}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.email}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{user.role}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button onClick={() => updateUserRole(user.id, "ADMIN")}>Make Admin</button>
                    <button onClick={() => updateUserRole(user.id, "USER")}>Make User</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {selectedSection === "orders" && (
        <section>
          <h1>Order Details</h1>
          {orders.length === 0 ? (
            <p>No orders available.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f4f4f4" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Order ID</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User ID</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Address</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>User City</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Name</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Price</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Quantity</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total Amount</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Order Date</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Payment Method</th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  order.items.map((item) => (
                    <tr key={`${order.id}-${item.productId}`}>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.id}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.userId}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.userData.username}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.userData.address}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.userData.city}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.productName}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>${item.price.toFixed(2)}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.quantity}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>${order.totalAmount.toFixed(2)}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {new Date(order.orderDate).toLocaleString()}
                      </td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.status}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{order.paymentMethod}</td>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {order.status === "PENDING" && (
                          <button
                            onClick={() => updateOrderStatusToShipped(order.id)}
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              padding: "5px",
                              borderRadius: "10px",
                            }}
                          >
                            Mark as SHIPPED
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          <section style={{ backgroundColor: "#333", padding: "20px", color: "white" , marginTop:"30px"}}>
          <h2>Sales Report</h2>
        <p>Total Sales: ${salesReport.totalSales.toFixed(2)}</p>
        <p>Total Orders: {salesReport.totalOrders}</p>
      </section>
        </section>
      )}

      {/* Conditionally render Add Product section */}
      {selectedSection === "addproduct" && <AdminProduct />}

      {selectedSection==="product" &&(
        <section>
          <center><h1>Products</h1></center>
          {product.length===0?(<h6>Product Not Available</h6>
          ):(
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product ID</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Name</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Image</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Discreption</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Discount</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Price</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Discount Price</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Stock</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>Delete</th>
              </tr>
              </thead>
              <tbody>
                {product.map((product)=>(
                  <tr key={`${product.id}`} style={{ backgroundColor: "#f4f4f4" }}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{product.id}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{product.name}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {product.image && (
                            <img
                                src={`http://localhost:8080${product.image}`}
                                alt={product.name}
                                style={{ width: "100%", height: "30px", objectFit: "cover"}}
                            />
                        )}

                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{product.description}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{product.discount}%</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{product.price}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{product.discountPrice.toFixed(2)}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{product.stock}</td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <button style={{backgroundColor:"red", borderRadius:"10px", padding:"5px"}} onClick={() => handleDelete(product.id)}>Delete</button>
                    </td>
                  </tr>

                ))}
              </tbody>
              </table>
          )}
       </section>
    )}
      
    </div>
  );
};

export default AdminDashboard;
