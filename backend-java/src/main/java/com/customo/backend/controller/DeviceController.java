package com.customo.backend.controller;

import com.customo.backend.dto.DeviceDto;
import com.customo.backend.entity.Device;
import com.customo.backend.service.DeviceService;
import com.customo.backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserDevices(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            if (search != null && !search.trim().isEmpty()) {
                List<DeviceDto> devices = deviceService.searchUserDevices(userId, search);
                response.put("success", true);
                response.put("data", Map.of(
                    "devices", devices,
                    "totalElements", devices.size(),
                    "totalPages", 1,
                    "currentPage", 0,
                    "size", devices.size()
                ));
                return ResponseEntity.ok(response);
            } else if (status != null && !status.trim().isEmpty()) {
                try {
                    Device.DeviceStatus deviceStatus = Device.DeviceStatus.valueOf(status.toUpperCase());
                    List<DeviceDto> devices = deviceService.getUserDevicesByStatus(userId, deviceStatus);
                    response.put("success", true);
                    response.put("data", Map.of(
                        "devices", devices,
                        "totalElements", devices.size(),
                        "totalPages", 1,
                        "currentPage", 0,
                        "size", devices.size()
                    ));
                    return ResponseEntity.ok(response);
                } catch (IllegalArgumentException e) {
                    response.put("success", false);
                    response.put("message", "Invalid status value");
                    return ResponseEntity.status(400).body(response);
                }
            } else {
                Pageable pageable = PageRequest.of(page, size);
                Page<DeviceDto> devices = deviceService.getUserDevices(userId, pageable);
                
                response.put("success", true);
                response.put("data", Map.of(
                    "devices", devices.getContent(),
                    "totalElements", devices.getTotalElements(),
                    "totalPages", devices.getTotalPages(),
                    "currentPage", devices.getNumber(),
                    "size", devices.getSize()
                ));
                
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching devices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserDevice(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            return deviceService.getUserDevice(userId, id)
                    .map(device -> {
                        response.put("success", true);
                        response.put("data", Map.of("device", device));
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        response.put("success", false);
                        response.put("message", "Device not found");
                        return ResponseEntity.status(404).body(response);
                    });
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching device: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createDevice(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @Valid @RequestBody DeviceDto deviceDto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            DeviceDto createdDevice = deviceService.createDevice(userId, deviceDto);
            response.put("success", true);
            response.put("data", Map.of("device", createdDevice));
            response.put("message", "Device created successfully");
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating device: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateDevice(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id,
            @Valid @RequestBody DeviceDto deviceDto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            return deviceService.updateDevice(userId, id, deviceDto)
                    .map(device -> {
                        response.put("success", true);
                        response.put("data", Map.of("device", device));
                        response.put("message", "Device updated successfully");
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        response.put("success", false);
                        response.put("message", "Device not found");
                        return ResponseEntity.status(404).body(response);
                    });
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating device: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDevice(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            boolean deleted = deviceService.deleteDevice(userId, id);
            if (deleted) {
                response.put("success", true);
                response.put("message", "Device deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Device not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting device: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateDeviceStatus(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            String statusStr = requestBody.get("status");
            if (statusStr == null) {
                response.put("success", false);
                response.put("message", "Status is required");
                return ResponseEntity.status(400).body(response);
            }

            Device.DeviceStatus status = Device.DeviceStatus.valueOf(statusStr.toUpperCase());
            DeviceDto updatedDevice = deviceService.updateDeviceStatus(userId, id, status);
            
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

    @PutMapping("/{id}/battery")
    public ResponseEntity<Map<String, Object>> updateDeviceBattery(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String id,
            @RequestBody Map<String, Integer> requestBody) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            Integer battery = requestBody.get("battery");
            if (battery == null || battery < 0 || battery > 100) {
                response.put("success", false);
                response.put("message", "Valid battery level (0-100) is required");
                return ResponseEntity.status(400).body(response);
            }

            DeviceDto updatedDevice = deviceService.updateDeviceBattery(userId, id, battery);
            
            response.put("success", true);
            response.put("data", Map.of("device", updatedDevice));
            response.put("message", "Device battery updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating device battery: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/low-battery")
    public ResponseEntity<Map<String, Object>> getLowBatteryDevices(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestParam(defaultValue = "20") Integer threshold) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            
            List<DeviceDto> devices = deviceService.getLowBatteryDevices(userId, threshold);
            response.put("success", true);
            response.put("data", Map.of("devices", devices));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching low battery devices: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}