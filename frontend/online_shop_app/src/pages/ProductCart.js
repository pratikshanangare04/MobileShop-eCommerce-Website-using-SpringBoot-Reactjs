import React, { useContext, useMemo } from "react";
import { ProductContext } from "./ProductContext";
import { Link } from "react-router-dom";

const ProductCart = () => {
  const { products, loading, error } = useContext(ProductContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <>
    <div style={{display:"flex", flexWrap:"wrap", gap:"20px"}}>
      {products.map((product) => (
        <div style={{display:"flex"}}>
        <div key={product.id} style={{ border: "1px solid #ccc", width: "280px", padding: "10px", marginLeft:"20px" }}>
          {product.image && (
                            <img
                                src={`http://localhost:8080${product.image}`}
                                alt={product.name}
                                style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
                            />
                        )}
          <h3>{product.name}</h3>
          <p>Price: Rs.{product.price}</p>
                      
          <button style={{border:"0px",padding:"10px",borderRadius:"10px",width:"150px",backgroundColor:"yellow"}}>Add To Cart</button><button style={{border:"0px",padding:"10px",borderRadius:"10px",marginLeft:"10px", width:"95px", backgroundColor:"yellow"}}>Buy Now</button>
        </div>
        </div>
      ))}
    </div>
    </>
  );

};

export default ProductCart;
