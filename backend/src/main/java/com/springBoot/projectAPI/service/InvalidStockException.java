package com.springBoot.projectAPI.service;

public class InvalidStockException extends RuntimeException {
	public InvalidStockException(String message) {
        super(message);
    }
}
