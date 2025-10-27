package com.customo.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;

@Entity
@Table(name = "device_logs")
public class DeviceLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LogLevel level;

    @NotBlank(message = "Log message is required")
    @Size(max = 1000, message = "Log message must not exceed 1000 characters")
    private String message;

    @Size(max = 2000, message = "Log details must not exceed 2000 characters")
    private String details;

    private Instant timestamp = Instant.now();

    // Constructors
    public DeviceLog() {}

    public DeviceLog(Device device, LogLevel level, String message) {
        this.device = device;
        this.level = level;
        this.message = message;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Device getDevice() { return device; }
    public void setDevice(Device device) { this.device = device; }

    public LogLevel getLevel() { return level; }
    public void setLevel(LogLevel level) { this.level = level; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public enum LogLevel {
        INFO, WARNING, ERROR, DEBUG
    }
}
