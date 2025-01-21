package com.springBoot.projectAPI.controller;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import com.springBoot.projectAPI.config.JwtUtil;
import com.springBoot.projectAPI.dto.AuthRequest;
import com.springBoot.projectAPI.dto.TokenResponse;
import com.springBoot.projectAPI.dto.User;
import com.springBoot.projectAPI.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new TokenResponse(token, user.getRole());
    }
    
    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/getUsers")
    public List<User> getAllUsers()
    {
    	return userRepository.findAll();
    }
    
    @GetMapping("/id/{userId}")
    public User getUserById(@PathVariable Long userId)
    {
    	Optional<User> user=userRepository.findById(userId);
    	if(user.isPresent())
    	{
    		return user.get();
    	}
    	return null;
    }
}
