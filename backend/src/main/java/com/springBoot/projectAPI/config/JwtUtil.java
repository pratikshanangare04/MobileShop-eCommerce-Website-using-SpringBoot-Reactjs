package com.springBoot.projectAPI.config;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

@Component
public class JwtUtil {

    //private final String SECRET_KEY = "secret";
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours


    public String generateToken(String email, String role) {
    	 return Jwts.builder()
                 .setSubject(email)
                 .claim("role", role)
                 .setIssuedAt(new Date())
                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                 .signWith(SECRET_KEY) // Uses the secure key
                 .compact();
    }
}

