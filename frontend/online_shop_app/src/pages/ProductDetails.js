import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "./ProductContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useContext(ProductContext);

  const product = products.find((prod) => prod.id === parseInt(id));

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div style={{ display: "flex", gap: "20px", margin: "20px" }}>
      <div style={{ flex: "1" }}>
        {product.image && (
          <img
            src={`http://localhost:8080${product.image}`}
            alt={product.name}
            style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "8px" }}
          />
        )}
      </div>
      <div style={{ flex: "2", padding: "10px" }}>
        <h1>{product.name}</h1>
        <p>Price: Rs.{product.price}</p>
        <p>{product.description}</p>
        <button style={{ padding: "10px 20px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px" }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
