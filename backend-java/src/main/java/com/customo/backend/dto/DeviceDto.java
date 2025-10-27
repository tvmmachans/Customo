package com.customo.backend.dto;

import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public class DeviceDto {
    private String id;
    
    @NotBlank(message = "Device name is required")
    @Size(max = 255, message = "Device name must not exceed 255 characters")
    private String name;
    
    @Size(max = 100, message = "Device type must not exceed 100 characters")
    private String type;
    
    private String status;
    
    @Min(value = 0, message = "Battery level cannot be negative")
    @Max(value = 100, message = "Battery level cannot exceed 100")
    private Integer battery;
    
    @Size(max = 500, message = "Location must not exceed 500 characters")
    private String location;
    
    @Size(max = 1000, message = "Tasks must not exceed 1000 characters")
    private String tasks;
    
    private boolean isOnline;
    private Instant lastSeen;
    private Instant createdAt;
    private Instant updatedAt;
    private List<DeviceLogDto> logs;

    // Constructors
    public DeviceDto() {}

    public DeviceDto(String name, String type) {
        this.name = name;
        this.type = type;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getBattery() { return battery; }
    public void setBattery(Integer battery) { this.battery = battery; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTasks() { return tasks; }
    public void setTasks(String tasks) { this.tasks = tasks; }

    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean online) { isOnline = online; }

    public Instant getLastSeen() { return lastSeen; }
    public void setLastSeen(Instant lastSeen) { this.lastSeen = lastSeen; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public List<DeviceLogDto> getLogs() { return logs; }
    public void setLogs(List<DeviceLogDto> logs) { this.logs = logs; }

    public static class DeviceLogDto {
        private String id;
        private String level;
        private String message;
        private String details;
        private Instant timestamp;

        // Constructors
        public DeviceLogDto() {}

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }

        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    }
}
