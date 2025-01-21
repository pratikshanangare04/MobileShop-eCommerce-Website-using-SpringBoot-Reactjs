package com.springBoot.projectAPI.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springBoot.projectAPI.dto.Order;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    
    List<Order> findByStatus(String status);

    // Custom query to count orders by status
    long countByStatus(String status);
}

