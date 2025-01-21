package com.springBoot.projectAPI.dto;

public class TokenResponse {
    private String token;
    private String role;

    public TokenResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

	public String getToken() {
		return token;
	}

	public String getRole() {
		return role;
	}

    
}

