package com.springBoot.projectAPI.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.springBoot.projectAPI.dto.User;
import com.springBoot.projectAPI.service.AdminService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/users/{userId}/role")
    public User updateUserRole(@PathVariable Long userId, @RequestParam String role) {
        return adminService.updateUserRole(userId, role);
    }

    @GetMapping("/sales-report")
    public SalesReport getSalesReport() {
        double totalSales = adminService.getTotalSales();
        long totalOrders = adminService.getTotalOrders();
        return new SalesReport(totalSales, totalOrders);
    }

    static class SalesReport {
        private double totalSales;
        private long totalOrders;

        public SalesReport(double totalSales, long totalOrders) {
            this.totalSales = totalSales;
            this.totalOrders = totalOrders;
        }

		public double getTotalSales() {
			return totalSales;
		}

		public void setTotalSales(double totalSales) {
			this.totalSales = totalSales;
		}

		public long getTotalOrders() {
			return totalOrders;
		}

		public void setTotalOrders(long totalOrders) {
			this.totalOrders = totalOrders;
		}

        
    }
}
