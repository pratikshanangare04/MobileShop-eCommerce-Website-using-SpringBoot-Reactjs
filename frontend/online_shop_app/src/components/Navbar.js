import {Link, useNavigate, NavLink} from "react-router-dom";
import Signimage from "../images/signin.jpeg"
import axios from "axios";
import { useState } from "react";
import CarouselComponent from "./CarouselComponent";
import image1 from "../images/OnePlus1.webp";
import image2 from "../images/realme1.jpg";
import image3 from "../images/samsang1.webp";
import image4 from "../images/iq1.jpg";
import image5 from "../images/honor.webp";
import MobileImage from "../images/mobile1.png"
import ProductPage from "../pages/ProductPage";



{/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" /> */}


const Navbar=()=>{
    const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/search`, {
        params: { name: query },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
    return(
       <div>
         <nav style={{backgroundColor:"black",padding:"15px", display:"flex", justifyContent:"flex-end",height:"70px"}}>
            <h3 style={{color:"white", position:"sticky", right:"1000px"}}>Mobile Shoppy</h3>
            <Link to="/signIn" style={{color:"white", fontSize:"20px",textDecoration:"none",marginLeft:"20px"}}><button style={{border:"0px", backgroundColor:"red",padding:"5px",borderRadius:"10px",height:"40px",color:"white"}}>Sign In</button></Link>
            <Link to="/signUp" style={{color:"white", fontSize:"20px",textDecoration:"none",marginLeft:"20px"}}><button style={{border:"0px", backgroundColor:"red",padding:"5px",borderRadius:"10px",height:"40px",color:"white"}}>Sign Up</button></Link>
            <div><input style={{marginLeft:"20px", padding:"5px", borderRadius:"10px"}}
        type="text"
        placeholder="Enter product name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
         <button onClick={handleSearch} style={{margin:"2px", padding:"5px", borderRadius:"10px"}}>Search</button></div>
        </nav>
        <div>
        <CarouselComponent />
        </div>
        


     <div>
      {selectedProduct ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "20px",
            margin: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            gap: "20px",
          }}
        >
          {/* Image on the left */}
          {selectedProduct.image && (
            <div style={{ flex: "1" }}>
              <img
                src={`http://localhost:8080${selectedProduct.image}`}
                alt={selectedProduct.name}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          {/* Information on the right */}
          <div style={{ flex: "1", textAlign: "left" }}>
            <h2>{selectedProduct.name}</h2>
            <p>
              <strong>Price:</strong> Rs.<del>{selectedProduct.price}</del>
            </p>
            <p>
              <strong>Discount:</strong> {selectedProduct.discount}%
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            <p>
            <strong>Stock:</strong>{" "}
            <span style={{ color: selectedProduct.stock > 0 ? "green" : "red" }}>
            {selectedProduct.stock > 0 ? `${selectedProduct.stock} Available` : "Out of Stock"}
            </span>
            </p>
            <p><strong>Discount Price:</strong> Rs.{selectedProduct.discountPrice}</p>
            <Link to="/signUp" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Add to Cart & Sign Up
              </button>
            </Link>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => setSelectedProduct(null)}
            >
              Back to Products
            </button>
          </div>
        </div>
      ) : (
        // Display product list
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              style={{
                border: "1px solid #ccc",
                width: "280px",
                padding: "10px",
                margin: "10px",
                cursor: "pointer",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {product.image && (
                <img
                  src={`http://localhost:8080${product.image}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              <h3>{product.name}</h3>
              <p>Price: Rs.{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    <center><h1 style={{marginTop:"60px", marginBottom:"50px"}}>Products</h1></center>

    <ProductPage/>

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
}

export default Navbar;