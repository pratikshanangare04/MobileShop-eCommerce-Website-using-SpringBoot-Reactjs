package com.springBoot.projectAPI.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springBoot.projectAPI.dto.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	public Optional<Product> findById(Long id);
	public void deleteById(Long id);
	
	public Product getProductById(Long id);
	

	public List<Product> findByNameContainingIgnoreCase(String name);
}