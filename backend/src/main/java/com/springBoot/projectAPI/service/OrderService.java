package com.springBoot.projectAPI.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springBoot.projectAPI.dto.Cart;
import com.springBoot.projectAPI.dto.CartItem;
import com.springBoot.projectAPI.dto.Order;
import com.springBoot.projectAPI.dto.OrderItem;
import com.springBoot.projectAPI.dto.Product;
import com.springBoot.projectAPI.repository.OrderItemRepository;
import com.springBoot.projectAPI.repository.OrderRepository;
import com.springBoot.projectAPI.repository.ProductRepository;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ProductService productService;

//    public Order placeOrder(Long userId) {
//        // Get user's cart
//        Cart cart = cartService.getCartByUserId(userId);
//
//        if (cart.getItems().isEmpty()) {
//            throw new RuntimeException("Cart is empty");
//        }
//
//        // Create order and populate details
//        Order order = new Order();
//        order.setUserId(userId);
//        order.setOrderDate(new Date());
//
//        // Map cart items to order items
//        double totalAmount = 0;
//        for (CartItem cartItem : cart.getItems()) {
//            Product product = productRepository.findById(cartItem.getProductId())
//                    .orElseThrow(() -> new RuntimeException("Product not found"));
//
//            OrderItem orderItem = new OrderItem();
//            orderItem.setProductId(product.getId());
//            orderItem.setProductName(product.getTitle());
//            orderItem.setPrice(product.getPrice());
//            orderItem.setQuantity(cartItem.getQuantity());
//
//            order.getItems().add(orderItem);
//            totalAmount += product.getPrice() * cartItem.getQuantity();
//        }
//
//        order.setTotalAmount(totalAmount);
//
//        // Save order
//        order = orderRepository.save(order);
//
//        // Clear user's cart
//        cartService.getCartByUserId(userId).getItems().clear();
//        return order;
//    }
    
    public Order placeOrder(Long userId) {
        // Get user's cart
        Cart cart = cartService.getCartByUserId(userId);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create order and populate details
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(new Date());
        order.setPaymentMethod("Cash on Delivery");
        

        // Initialize the items list if it is null
        if (order.getItems() == null) {
            order.setItems(new ArrayList<>());
        }

        // Map cart items to order items
        double totalAmount = 0;
        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setPrice(product.getDiscountPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            order.getItems().add(orderItem);  // Safely adding to the list
            totalAmount += product.getDiscountPrice()* cartItem.getQuantity();
        }

        order.setTotalAmount(totalAmount);

        // Save order
        order = orderRepository.save(order);

        cartService.updateStockAfterOrder(cart.getItems());
        cartService.clearCart(userId);
        // Clear user's cart
        cartService.getCartByUserId(userId).getItems().clear();
        return order;
    }


    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    
//    public Order cancelOrder(Long orderId) {
//        // Fetch the order by id
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new ResourceNotFoundException("Order not found for id " + orderId));
//
//        // Check if the order is in 'PENDING' status, which can be canceled
//        if (order.getStatus() != Order.OrderStatus.PENDING) {
//            throw new IllegalStateException("Only orders with 'PENDING' status can be canceled.");
//        }
//
//        // Return the stock for each product in the order
//        for (OrderItem item : order.getItems()) {
//            // Get the product and its current stock
//            Product product = productRepository.findById(item.getProductId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Product not found for id " + item.getProductId()));
//
//            // Increase the stock for the product
//            product.setStock(product.getStock() + item.getQuantity());
//
//            // Save the updated product back to the database
//            productRepository.save(product);
////            orderRepository.delete(order);
//        }
//
//        // Update the order status to 'CANCELED'
//        order.setStatus(Order.OrderStatus.CANCELED);
//
//        // Save the updated order
//        return orderRepository.save(order);
//    }
    
    public void cancelOrder(Long orderId) {
        // Fetch the order by id
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for id " + orderId));

        // Check if the order is in 'PENDING' status, which can be canceled
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalStateException("Only orders with 'PENDING' status can be canceled.");
        }

        // Return the stock for each product in the order and delete order items
        for (OrderItem item : order.getItems()) {
            // Get the product and its current stock
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found for id " + item.getProductId()));

            // Increase the stock for the product
            product.setStock(product.getStock() + item.getQuantity());

            // Save the updated product back to the database
            productRepository.save(product);

            // Remove the order item from the database
            orderItemRepository.delete(item);  // Assuming orderItemRepository is injected
        }

        // Remove the order from the database
        orderRepository.delete(order);
    }

    
    public List<Order> getAllOrderDetails() {
        // Fetch all orders from the database
        List<Order> orders = orderRepository.findAll();

        // Extract product IDs from all order items
        List<Long> productIds = orders.stream()
                                      .flatMap(order -> order.getItems().stream())
                                      .map(OrderItem::getProductId)
                                      .collect(Collectors.toList());

        // Fetch all products in one query
        List<Product> products = productRepository.findAllById(productIds);
        Map<Long, Product> productMap = products.stream()
                                                .collect(Collectors.toMap(Product::getId, product -> product));

        // Enrich each order with product details
        List<Order> enrichedOrders = new ArrayList<>();
        for (Order order : orders) {
            List<OrderItem> enrichedOrderItems = new ArrayList<>();
            for (OrderItem item : order.getItems()) {
                Product product = productMap.get(item.getProductId());
                if (product == null) {
                    throw new ResourceNotFoundException("Product not found for id " + item.getProductId());
                }

                enrichedOrderItems.add(new OrderItem(
                        product.getId(),
                        product.getName(),
                        product.getDiscountPrice(),
                        item.getQuantity()
                ));
            }

            enrichedOrders.add(new Order(
                    order.getId(),
                    order.getUserId(),
                    order.getStatus(),
                    order.getOrderDate(),
                    order.getTotalAmount(),
                    order.getPaymentMethod(),
                    enrichedOrderItems
            ));
        }

        return enrichedOrders;
    }


    public Order updateOrderStatusToShipped(Long orderId) {
        // Fetch the order by id
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for id " + orderId));

        // Check if the order is in 'PENDING' status, which can be updated to 'SHIPPED'
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalStateException("Only orders with 'PENDING' status can be marked as 'SHIPPED'.");
        }

        // Update the order status to 'SHIPPED'
        order.setStatus(Order.OrderStatus.SHIPPED);

        // Save the updated order
        return orderRepository.save(order);
    }

}
