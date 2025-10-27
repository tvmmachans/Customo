package com.customo.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final Map<Integer, Map<String, Object>> devices = Collections.synchronizedMap(new LinkedHashMap<>());

    public DeviceController() {
        // seed with sample devices (match frontend demo data)
        Map<String, Object> d1 = new HashMap<>();
        d1.put("id", 1);
        d1.put("name", "Guardian Security Bot X1");
        d1.put("type", "Security");
        d1.put("status", "active");
        d1.put("battery", 85);
        d1.put("location", "Warehouse A - Zone 1");
        d1.put("lastSeen", "2 minutes ago");
        d1.put("isOnline", true);
        d1.put("tasks", "Perimeter patrol active");

        Map<String, Object> d2 = new HashMap<>();
        d2.put("id", 2);
        d2.put("name", "HomePal Assistant Pro");
        d2.put("type", "Assistant");
        d2.put("status", "idle");
        d2.put("battery", 92);
        d2.put("location", "Living Room");
        d2.put("lastSeen", "5 minutes ago");
        d2.put("isOnline", true);
        d2.put("tasks", "Standby mode");

        Map<String, Object> d3 = new HashMap<>();
        d3.put("id", 3);
        d3.put("name", "IndustriMax Welder 3000");
        d3.put("type", "Industrial");
        d3.put("status", "maintenance");
        d3.put("battery", 45);
        d3.put("location", "Factory Floor B");
        d3.put("lastSeen", "1 hour ago");
        d3.put("isOnline", false);
        d3.put("tasks", "Scheduled maintenance");

        devices.put(1, d1);
        devices.put(2, d2);
        devices.put(3, d3);
    }

    @GetMapping
    public ResponseEntity<?> listDevices() {
        return ResponseEntity.ok(Map.of("devices", devices.values()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDevice(@PathVariable int id) {
        Map<String, Object> d = devices.get(id);
        if (d == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("device", d));
    }

    @PostMapping("/{id}/control")
    public ResponseEntity<?> controlDevice(@PathVariable int id, @RequestBody Map<String, Object> body) {
        String action = (String) body.getOrDefault("action", "");
        Map<String, Object> d = devices.get(id);
        if (d == null) return ResponseEntity.notFound().build();

        synchronized (d) {
            switch (action) {
                case "start":
                    if ("maintenance".equals(d.get("status"))) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Device in maintenance"));
                    }
                    d.put("status", "active");
                    d.put("tasks", "Running");
                    d.put("isOnline", true);
                    break;
                case "pause":
                    d.put("status", "idle");
                    d.put("tasks", "Paused");
                    break;
                case "reset":
                    d.put("tasks", "Resetting...");
                    // simulate reset by scheduling a follow-up thread
                    new Timer().schedule(new TimerTask() {
                        @Override
                        public void run() {
                            d.put("tasks", "Idle after reset");
                            d.put("status", "idle");
                            Integer b = (Integer) d.getOrDefault("battery", 0);
                            d.put("battery", Math.min(100, b + 5));
                        }
                    }, 1200);
                    break;
                case "toggle_power":
                    if ("maintenance".equals(d.get("status"))) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Device in maintenance"));
                    }
                    String next = "active".equals(d.get("status")) ? "idle" : "active";
                    d.put("status", next);
                    d.put("tasks", "active".equals(next) ? "Running" : "Standby");
                    break;
                case "settings":
                    // no-op for demo
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of("message", "Unknown action"));
            }
        }

        return ResponseEntity.ok(Map.of("device", d));
    }
}
