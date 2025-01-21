package com.springBoot.projectAPI.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springBoot.projectAPI.dto.Product;
import com.springBoot.projectAPI.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        Product product = getProductById(id);
        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setDiscount(updatedProduct.getDiscount());
        product.setIsActive(updatedProduct.getIsActive());
        product.setDiscountPrice(updatedProduct.getDiscountPrice());
        Double disocunt = product.getPrice() * (product.getDiscount() / 100.0);
		Double discountPrice = product.getPrice() - disocunt;
		product.setDiscountPrice(discountPrice);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public void updateStock(Long productId, int stock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found for id " + productId));

        product.setStock(stock);
        productRepository.save(product);
    }
    
    public void updateStockAfterOrderCancellation(Product product, int quantity) {
        // Update the product stock by adding the quantity back
        product.setStock(product.getStock() + quantity);
        productRepository.save(product);
    }
    
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}
