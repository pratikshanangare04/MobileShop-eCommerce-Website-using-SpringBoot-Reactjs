import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure JS is imported for carousel functionality

// Import Images
import home1 from "../images/home1.jpg";
import home2 from "../images/home2.jpg";
import home3 from "../images/home6.jpg";
import home4 from "../images/home4.jpg";
import home5 from "../images/home5.jpg";

const CarouselComponent = () => {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3" aria-label="Slide 4"></button>
        {/* <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="4" aria-label="Slide 5"></button> */}
      </div>

      {/* Carousel Items */}
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="1000">
          <img src={home2} className="d-block w-100" alt="Image 1" style={{height:"500px"}} />
        </div>
        <div className="carousel-item" data-bs-interval="1000">
          <img src={home3} className="d-block w-100" alt="Image 2" style={{height:"500px"}} />
        </div>
        <div className="carousel-item" data-bs-interval="1000">
          <img src={home4} className="d-block w-100" alt="Image 3" style={{height:"500px"}} />
        </div>
        <div className="carousel-item" data-bs-interval="1000">
          <img src={home5} className="d-block w-100" alt="Image 4" style={{height:"500px"}} />
        </div>
        {/* <div className="carousel-item" data-bs-interval="1000">
          <img src={home5} className="d-block w-100" alt="Image 5" style={{height:"500px"}} />
        </div> */}
      </div>

      {/* Previous Button */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      {/* Next Button */}
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default CarouselComponent;
