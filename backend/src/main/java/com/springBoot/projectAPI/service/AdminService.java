package com.springBoot.projectAPI.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springBoot.projectAPI.dto.Order;
import com.springBoot.projectAPI.dto.User;
import com.springBoot.projectAPI.repository.OrderRepository;
import com.springBoot.projectAPI.repository.UserRepository;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    public double getTotalSales() {
        return orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }
}

