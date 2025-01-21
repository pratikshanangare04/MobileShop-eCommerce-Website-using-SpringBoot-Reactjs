import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  console.log(products);
  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
