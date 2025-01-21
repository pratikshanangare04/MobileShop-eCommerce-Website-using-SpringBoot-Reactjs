import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link , useNavigate, NavLink} from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    fetchCart();
    fetchTotalPrice();
  }, []);

  useEffect(() => {
    if (cart?.length > 0) { // Add optional chaining
      fetchProductDetails();
    }
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/cart/${userId}`);
      setCart(response.data.items);
      setError(null); // Clear previous errors
    } catch (err) {
      setCart([]); 
      setError("Failed to fetch cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalPrice = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cart/${userId}/total`);
      setTotalPrice(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch total price. Please try again.");
    }
  };

  const fetchProductDetails = async () => {
    try {
      const productIds = cart.map((item) => item.productId).join(",");
      const response = await axios.get(`http://localhost:8080/api/products`, {
        params: { ids: productIds },
      });
      setProducts(response.data || []);
    } catch (err) {
      setError("Failed to fetch product details. Please try again.");
    }
  };

  const getProductDetails = (productId) => {
    return products.find((p) => p.id === productId) || {};
  };

  const handleAdd = async (productId) => {
    const productDetails = getProductDetails(productId);
    const availableStock = productDetails.stock || 0;
    const productInCart = cart.find((item) => item.productId === productId);

    if (productInCart && productInCart.quantity + 1 > availableStock) {
      setError(`Cannot add more than available stock (${availableStock}).`);
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/cart/${userId}/add2`, null, {
        params: { productId, quantity: 1 },
      });
      fetchCart();
      fetchTotalPrice();
    } catch (err) {
      setError("Failed to add item. Please try again.");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${userId}/remove`, {
        params: { productId },
      });
      fetchCart();
      fetchTotalPrice();
    } catch (err) {
      setError("Failed to remove item. Please try again.");
    }
  };

  const handleUpdate = async (productId, quantity) => {
    const productDetails = getProductDetails(productId);
    const availableStock = productDetails.stock || 0;

    if (quantity > availableStock) {
      setError(`Quantity exceeds available stock (${availableStock}).`);
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/cart/${userId}/update`, null, {
        params: { productId, quantity },
      });
      fetchCart();
      fetchTotalPrice();
    } catch (err) {
      setError("Failed to update quantity. Please try again.");
    }
  };

  // const handlePlaceOrder = async () => {
  //   try {
  //     const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  //     const headers = token ? { Authorization: `Bearer ${token}` } : {};
  //     const response = await axios.post(`http://localhost:8080/api/orders/place/${userId}`, null, { headers });
  
  //     alert("Order placed successfully!");
  //     //navigate("/orders/history");
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || error.message;
  //     alert(`Error placing order: ${errorMessage}`);
  //   }
  // };
  
  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Place the order
      const response = await axios.post(`http://localhost:8080/api/orders/place/${userId}`, null, { headers });
  
      // After successful order placement, update stock and clear cart
      await updateStockAndClearCart();
      
      alert("Order placed successfully! Pay on delivery.");
      navigate("/order/place/submit"); // Optionally navigate to order history page
  
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error placing order: ${errorMessage}`);
    }
  };
  
  // Function to update product stock and clear cart
  const updateStockAndClearCart = async () => {
    try {
      // Update product stock
      await Promise.all(cart.map(async (item) => {
        const productDetails = getProductDetails(item.productId);
        const newStock = productDetails.stock - item.quantity;
  
        await axios.put(`http://localhost:8080/api/products/${item.productId}/updateStock`, null, {
          params: { stock: newStock },
        });
      }));
  
      // Clear the cart by removing items from the cart
      await axios.delete(`http://localhost:8080/api/cart/${userId}/clear`);
  
      // Fetch the updated cart and total price after clearing
      fetchCart();
      fetchTotalPrice();
    } catch (err) {
      setError("Failed to update stock and clear cart. Please try again.");
    }
  };
  

  return (
    <div style={{ width: "1270px" }}>
      <nav style={{ backgroundColor: "black", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "70px", width: "1270px" }}>
        <h3 style={{ color: "white" }}>Online Shoppy</h3>
        <div style={{ display: "flex", justifyContent: "space-around", flexGrow: 1 }}>
          <Link to="/user/products" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>Products</Link>
          <Link to="/orders/history" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>My Orders</Link>
          <Link to="/cart" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>My Cart</Link>
          <h1 style={{ color: "white", marginLeft: "20px", fontSize: "20px" }}>Welcome, {username}</h1>
          <Link to="/logOut" style={{ color: "white", fontSize: "20px", textDecoration: "none" }}>
            <button style={{ border: "0px", backgroundColor: "red", padding: "5px", borderRadius: "10px", height: "40px", color: "white" }}>Log Out</button>
          </Link>
        </div>
      </nav>
     <center><h2 style={{margin:"40px"}}>Your Cart</h2></center> 
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
    <p>Loading...</p>
) : cart?.length === 0 ? (
    <p>Your cart is empty.</p>
) : (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {Array.isArray(cart) &&
            cart.map((item) => {
                const productDetails = getProductDetails(item.productId);
                return (
                    <div key={item.productId} style={{ border: "1px solid #ccc", width: "280px", padding: "10px", marginLeft: "20px" }}>
                        <img src={`http://localhost:8080${productDetails.image}`} alt={productDetails.title} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px" }} />
  
                        <p><strong>Name:</strong> {productDetails.title} </p> 
                        <p> <strong>Price:</strong> Rs.{productDetails.price} </p> 
                        <p><strong>Discount Price:</strong> Rs.{productDetails.discountPrice}</p>
                        <p> <strong>Quantity:</strong> {item.quantity} </p> 
                        <p> <strong>Available Stock:</strong> {productDetails.stock}</p> 
                        <button
                  style={{ marginLeft: "10px", padding: "5px", borderRadius: "5px", backgroundColor: "green", color: "white" }}
                  onClick={() => handleAdd(item.productId)}
                >
                  +
                </button>
                <button
                  style={{ marginLeft: "10px", padding: "5px", borderRadius: "5px", backgroundColor: "red", color: "white" }}
                  onClick={() => handleRemove(item.productId)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => handleUpdate(item.productId, parseInt(e.target.value) || 1)}
                  style={{ marginLeft: "10px", padding: "5px", borderRadius: "5px", width: "70px"}}
                />

                <button style={{padding:"5px", margin:"20px", borderRadius:"10%", fontSize:"20px", backgroundColor:"yellow"}} onClick={()=>handlePlaceOrder()}>Order</button>
            </div>
                );
            })}
    </div>
   )}

      <center><h3 style={{margin:"40px"}}>Total Price: Rs.{totalPrice.toFixed(2)}</h3></center>

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
};

export default Cart;
