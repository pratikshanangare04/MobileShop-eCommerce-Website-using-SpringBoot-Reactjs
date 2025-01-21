package com.springBoot.projectAPI.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springBoot.projectAPI.dto.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	public Optional<User> findByUsername(String name);
	
	public Optional<User> findByEmail(String email);
	
	public Optional<User> findById(Long userId);
}
