import React from "react";
import { ProductProvider } from "./ProductContext";
import DisplayProduct from "./DisplayProduct";
const DisplayPage = ({userData}) => {
  return (
    <>
    <ProductProvider>
      <DisplayProduct/>
    </ProductProvider>
    </>
  );
};

export default DisplayPage;
