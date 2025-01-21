package com.springBoot.projectAPI.dto;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    
    public enum OrderStatus {
        PENDING,
        SHIPPED,
        CANCELED
    }
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    private double totalAmount;
    
    private String paymentMethod;

    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> items;

    public Order() {
        super();
        this.status = OrderStatus.PENDING; // Default status set to PENDING
    }
    
    

	public Order(Long id, Long userId, OrderStatus status, Date orderDate, double totalAmount, String paymentMethod,
			List<OrderItem> items) {
		super();
		this.id = id;
		this.userId = userId;
		this.status = status;
		this.orderDate = orderDate;
		this.totalAmount = totalAmount;
		this.paymentMethod = paymentMethod;
		this.items = items;
	}



	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Date getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	
    
}

