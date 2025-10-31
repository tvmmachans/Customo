package com.customo.backend.controller;

import com.customo.backend.dto.DeviceDto;
import com.customo.backend.dto.OrderDto;
import com.customo.backend.entity.Device;
import com.customo.backend.service.DeviceService;
import com.customo.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class AdminController {

    private final DeviceService deviceService;
    private final ProductService productService;

    public AdminController(DeviceService deviceService, ProductService productService) {
        this.deviceService = deviceService;
        this.productService = productService;
    }

    @GetMapping("/devices")
    public ResponseEntity<Map<String, Object>> getAllDevices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            // For simplicity, get all devices without pagination for admin
            // In a real app, implement getAllDevices in DeviceService
            response.put("success", true);
            response.put("data", Map.of("devices", java.util.List.of())); // Placeholder
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching devices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Placeholder for orders
            response.put("success", true);
            response.put("data", Map.of("orders", java.util.List.of()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching orders: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/devices/{id}/status")
    public ResponseEntity<Map<String, Object>> updateDeviceStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody) {
        Map<String, Object> response = new HashMap<>();
        try {
            String statusStr = requestBody.get("status");
            Device.DeviceStatus status = Device.DeviceStatus.valueOf(statusStr.toUpperCase());
            DeviceDto updatedDevice = deviceService.updateDeviceStatus(null, id, status); // Admin can update any device

            response.put("success", true);
            response.put("data", Map.of("device", updatedDevice));
            response.put("message", "Device status updated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid status value");
            return ResponseEntity.status(400).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating device status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
