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



    
//    public Order placeOrder(Long userId, Long productId) {
//        Cart cart = cartService.getCartByUserId(userId);
//
//        CartItem cartItem = cart.getItems().stream()
//                .filter(item -> item.getProductId().equals(productId))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Product not found in cart"));
//
//        Order order = new Order();
//        order.setUserId(userId);
//        order.setOrderDate(new Date());
//        order.setPaymentMethod("Cash on Delivery");
//        order.setItems(new ArrayList<>());
//
//        Product product = productRepository.findById(productId)
//                .orElseThrow(() -> new RuntimeException("Product not found"));
//
//        OrderItem orderItem = new OrderItem();
//        orderItem.setProductId(product.getId());
//        orderItem.setProductName(product.getName());
//        orderItem.setPrice(product.getDiscountPrice());
//        orderItem.setQuantity(cartItem.getQuantity());
//        order.getItems().add(orderItem);
//
//        double totalAmount = product.getDiscountPrice() * cartItem.getQuantity();
//        order.setTotalAmount(totalAmount);
//
//        order = orderRepository.save(order);
//
//        cartService.updateStockAfterOrder(List.of(cartItem));
//
//        cart.getItems().remove(cartItem);
//        cartService.saveCart(cart);
//
//        return order;
//    }

    @Transactional
    public Order placeOrder(Long userId, Long productId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("No items in cart");
        }

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderDate(new Date());
        order.setPaymentMethod("Cash on Delivery");
        order.setItems(new ArrayList<>());

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        OrderItem orderItem = new OrderItem();
        orderItem.setProductId(product.getId());
        orderItem.setProductName(product.getName());
        orderItem.setPrice(product.getDiscountPrice());
        orderItem.setQuantity(cartItem.getQuantity());
        order.getItems().add(orderItem);

        double totalAmount = product.getDiscountPrice() * cartItem.getQuantity();
        order.setTotalAmount(totalAmount);

        // Save the order
        order = orderRepository.save(order);

        // Update stock and clear the cart in one transaction
        cartService.updateStockAfterOrder(List.of(cartItem));
        cart.getItems().remove(cartItem);
        cartService.saveCart(cart);  // Save the cart after removing items

        return order;
    }




    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    

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
        List<Order> orders = orderRepository.findAll();

        List<Long> productIds = orders.stream()
                                      .flatMap(order -> order.getItems().stream())
                                      .map(OrderItem::getProductId)
                                      .collect(Collectors.toList());

        List<Product> products = productRepository.findAllById(productIds);
        Map<Long, Product> productMap = products.stream()
                                                .collect(Collectors.toMap(Product::getId, product -> product));
        
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
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for id " + orderId));

        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalStateException("Only orders with 'PENDING' status can be marked as 'SHIPPED'.");
        }

        order.setStatus(Order.OrderStatus.SHIPPED);

        return orderRepository.save(order);
    }

}
