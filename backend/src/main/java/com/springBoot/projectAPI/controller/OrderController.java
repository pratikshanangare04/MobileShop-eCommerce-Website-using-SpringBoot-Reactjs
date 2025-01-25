package com.springBoot.projectAPI.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springBoot.projectAPI.dto.Order;
import com.springBoot.projectAPI.service.OrderService;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place/{userId}/{productId}")
    public Order placeOrder(@PathVariable Long userId, @PathVariable Long productId) {
        return orderService.placeOrder(userId, productId);
    }

    @GetMapping("/history/{userId}")
    public List<Order> getOrderHistory(@PathVariable Long userId) {
        return orderService.getOrderHistory(userId);
    }
    
//    @PutMapping("/cancel/{orderId}")
//    public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId) {
//        try {
//            // Call service method to cancel the order
//            Order canceledOrder = orderService.cancelOrder(orderId);
//            return ResponseEntity.ok(canceledOrder);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(null);
//        }
//    }
    
    @DeleteMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId) {
        try {
            // Call service method to cancel the order
            orderService.cancelOrder(orderId);
            return ResponseEntity.ok("Order canceled successfully and removed from the system.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @PutMapping("/{orderId}/status/shipped")
    public ResponseEntity<Order> updateOrderStatusToShipped(@PathVariable Long orderId) {
        try {
            // Call the service method to update the status to SHIPPED
            Order updatedOrder = orderService.updateOrderStatusToShipped(orderId);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (Exception e) {
            // Return a bad request response if an error occurs
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/getOrders")
    public ResponseEntity<List<Order>> getOrderDetails() {
        // Fetch the order details
    	 List<Order> enrichedOrders = orderService.getAllOrderDetails(); // Call the service method
         return ResponseEntity.ok(enrichedOrders);
    }
 
}
