package com.customo.backend.dto;

public class AuthResponse {
    public String token;
    public UserDTO user;

    public static class UserDTO {
        public String id;
        public String email;
        public String firstName;
        public String lastName;
        public String phone;
        public String company;
        public String role;
    }
}
