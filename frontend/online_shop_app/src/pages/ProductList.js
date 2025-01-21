import React, { useContext, useState } from "react";
import { ProductContext } from "./ProductContext";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { products, loading, error } = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return <p>No products available</p>;
  }

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
          {products.map((product) => (
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

export default ProductList;
