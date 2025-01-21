// src/components/SearchResult.js
import React from 'react';
import axios from 'axios';
import { useState } from 'react';

const SearchResult = ({ results }) => {
    const [selectedProduct, setSelectedProduct] = useState(null); // Track the clicked product
  const [quantity, setQuantity] = useState(1); // Track the selected quantity
  const [message, setMessage] = useState(""); // Message for success/error

 
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to add items to your cart.");
      return;
    }

    if (quantity <= 0) {
      setMessage("Quantity must be at least 1.");
      return;
    }

    try {
      const productId = selectedProduct.id;
      const userId = localStorage.getItem("id");

      const response = await axios.post(
        `http://localhost:8080/api/cart/${userId}/add2`,
        null,
        {
          params: {
            productId: productId,
            quantity: quantity,
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      setMessage("Product added to cart successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (err) {
      console.error(err);
      setMessage("Failed to add product to cart. Please try again.");
    }
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null); // Reset to show the product list
  };
  return (
    <div>
      {selectedProduct ? (
        // Display selected product details
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
            <button
              onClick={handleAddToCart}
              style={{
                padding: "10px 20px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Add to Cart
            </button>
            {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
            <button
              onClick={handleBackToProducts}
              style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
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
  );
};

export default SearchResult;
