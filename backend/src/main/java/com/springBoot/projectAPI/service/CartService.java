package com.springBoot.projectAPI.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springBoot.projectAPI.dto.Cart;
import com.springBoot.projectAPI.dto.CartItem;
import com.springBoot.projectAPI.dto.Product;
import com.springBoot.projectAPI.repository.CartRepository;
import com.springBoot.projectAPI.repository.ProductRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public Cart getCartByUserId(Long userId) {
//        return cartRepository.findByUserId(userId)
//                .orElseGet(() -> cartRepository.save(new Cart(userId)));
    	Optional<Cart> opCart= cartRepository.findByUserId(userId);
    	if(opCart.isPresent())
    	{
    		return opCart.get();
    	}
    	return null;
    }

    public Cart saveCart(Cart cart)
    {
    	return cartRepository.save(cart);
    }

    public Cart addToCart2(Long userId, Long productId, int quantity) {
        // Check if the cart exists for the user
        Cart cart = getCartByUserId(userId);
        
        if (cart == null) {
            // If the cart doesn't exist, create a new one
            cart = new Cart();
            cart.setUserId(userId);  // assuming you set the userId
            cart.setItems(new ArrayList<>());  // Initialize an empty list of items
        }

        // Check if the product already exists in the cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // If the item exists, update the quantity
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            // If the item doesn't exist, create a new cart item and add it
            CartItem newItem = new CartItem();
            newItem.setProductId(productId);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        // Save the cart and return the updated cart
        return cartRepository.save(cart);
    }


    public Cart addToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductId(productId);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    public Cart updateCartItem(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));
        return cartRepository.save(cart);
    }
    
    public Cart updateCart(Cart cart) {
        // Save the cart after any modifications (e.g., clearing items)
        return cartRepository.save(cart);
    }

//    public double calculateTotalPrice(Long userId) {
//        Cart cart = getCartByUserId(userId);
//        return cart.getItems().stream()
//                .mapToDouble(item -> {
//                    Product product = productRepository.findById(item.getProductId())
//                            .orElseThrow(() -> new RuntimeException("Product not found"));
//                    return product.getPrice() * item.getQuantity();
//                })
//                .sum();
//    }
    
    public double calculateTotalPrice(Long userId) {
        Cart cart = getCartByUserId(userId);
        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return 0.0; // Return 0 if cart or items are missing
        }

        return cart.getItems().stream()
                .mapToDouble(item -> {
                    Product product = productRepository.findById(item.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found for ID: " + item.getProductId()));
                    return product.getDiscountPrice() * item.getQuantity();
                })
                .sum();
    }

 // Clear the user's cart
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear(); // Clear all items in the cart
        cartRepository.save(cart); // Save the cart
    }
//
//    public void updateStockAfterOrder(List<CartItem> cartItems) {
//        for (CartItem item : cartItems) {
//            // Use Optional to retrieve the product from the repository
//            Optional<Product> optionalProduct = productRepository.findById(item.getProductId());
//
//            // If the product is not found, throw ResourceNotFoundException
//            optionalProduct.orElseThrow(() -> new ResourceNotFoundException("Product not found for id " + item.getProductId()));
//
//            // If the product is present, check the stock and update it
//            optionalProduct.ifPresent(product -> {
//                // Calculate the new stock after the order
//                int newStock = product.getStock() - item.getQuantity();
//
//                // Check if stock is sufficient
//                if (newStock < 0) {
//                    throw new InvalidStockException("Not enough stock for product: " + product.getName());
//                }
//
//                // Update product stock and save the product
//                product.setStock(newStock);
//                productRepository.save(product);
//            });
//        }
//    }
    
    public void updateStockAfterOrder(List<CartItem> cartItems) {
        for (CartItem item : cartItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found for stock update"));
            // Update product stock (assuming you have a stock field in your Product entity)
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }
    }

}


