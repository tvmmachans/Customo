package com.customo.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        String msg = ex.getMessage() == null ? "Bad request" : ex.getMessage();
        // Some services throw IllegalArgumentException for invalid credentials; map to 401 when appropriate
        if (msg.toLowerCase().contains("invalid credentials") || msg.toLowerCase().contains("not found")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", msg));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "Internal server error"));
    }
}
