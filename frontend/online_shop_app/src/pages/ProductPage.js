import React from "react";
import { ProductProvider } from "./ProductContext";
import ProductList from "./ProductList";
import { Link } from "react-router-dom";

const ProductPage = () => {
  return (
    <>
    <ProductProvider>
      <ProductList />
    </ProductProvider>
    </>
  );
};

export default ProductPage;
