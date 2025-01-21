package com.springBoot.projectAPI.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.springBoot.projectAPI.dto.Cart;
import com.springBoot.projectAPI.service.CartService;
import com.springBoot.projectAPI.service.OrderService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;
    
    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId);
    }

    @PostMapping("/{userId}/add")
    public Cart addToCart(@PathVariable Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        return cartService.addToCart(userId, productId, quantity);
    }
    
    @PostMapping("/{userId}/add2")
    public Cart addToCart2(@PathVariable Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        return cartService.addToCart2(userId, productId, quantity);
    }

    @DeleteMapping("/{userId}/remove")
    public Cart removeFromCart(@PathVariable Long userId, @RequestParam Long productId) {
        return cartService.removeFromCart(userId, productId);
    }

    @PutMapping("/{userId}/update")
    public Cart updateCartItem(@PathVariable Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        return cartService.updateCartItem(userId, productId, quantity);
    }

//    @GetMapping("/{userId}/total")
//    public double calculateTotalPrice(@PathVariable Long userId) {
//        return cartService.calculateTotalPrice(userId);
//    }
    
    @GetMapping("/{userId}/total")
    public ResponseEntity<Double> calculateTotalPrice(@PathVariable Long userId) {
        try {
            double totalPrice = cartService.calculateTotalPrice(userId);
            return ResponseEntity.ok(totalPrice); // Return the total price with 200 OK
        } catch (RuntimeException e) {
            // Handle cases like cart not found or product missing
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(0.0);
        }
    }
    
    @PostMapping("/place/{userId}")
    public ResponseEntity<Void> placeOrder(@PathVariable Long userId) {
        try {
            orderService.placeOrder(userId); // Place the order
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Return bad request if any error occurs
        }
    }

    // Endpoint to clear the cart (can be called after order placement)
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
}

