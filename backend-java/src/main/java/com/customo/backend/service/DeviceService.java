package com.customo.backend.service;

import com.customo.backend.dto.DeviceDto;
import com.customo.backend.entity.Device;
import com.customo.backend.entity.DeviceLog;
import com.customo.backend.entity.User;
import com.customo.backend.repository.DeviceLogRepository;
import com.customo.backend.repository.DeviceRepository;
import com.customo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceLogRepository deviceLogRepository;

    @Autowired
    private UserRepository userRepository;

    public List<DeviceDto> getUserDevices(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        return deviceRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Page<DeviceDto> getUserDevices(String userId, Pageable pageable) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        return deviceRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(this::convertToDto);
    }

    public Optional<DeviceDto> getUserDevice(String userId, String deviceId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        return deviceRepository.findByUserAndId(user, deviceId)
                .map(this::convertToDto);
    }

    public DeviceDto createDevice(String userId, DeviceDto deviceDto) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Device device = convertToEntity(deviceDto);
        device.setUser(user);
        device.setStatus(Device.DeviceStatus.ACTIVE);
        device.setBattery(100);
        device.setOnline(true);
        device.setLastSeen(Instant.now());

        Device savedDevice = deviceRepository.save(device);
        
        // Log device creation
        DeviceLog log = new DeviceLog(savedDevice, DeviceLog.LogLevel.INFO, "Device created successfully");
        deviceLogRepository.save(log);

        return convertToDto(savedDevice);
    }

    public Optional<DeviceDto> updateDevice(String userId, String deviceId, DeviceDto deviceDto) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        return deviceRepository.findByUserAndId(user, deviceId)
                .map(existingDevice -> {
                    updateDeviceFields(existingDevice, deviceDto);
                    Device savedDevice = deviceRepository.save(existingDevice);
                    
                    // Log device update
                    DeviceLog log = new DeviceLog(savedDevice, DeviceLog.LogLevel.INFO, "Device updated");
                    deviceLogRepository.save(log);
                    
                    return convertToDto(savedDevice);
                });
    }

    public boolean deleteDevice(String userId, String deviceId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Optional<Device> device = deviceRepository.findByUserAndId(user, deviceId);
        if (device.isPresent()) {
            // Log device deletion
            DeviceLog log = new DeviceLog(device.get(), DeviceLog.LogLevel.INFO, "Device deleted");
            deviceLogRepository.save(log);
            
            deviceRepository.deleteByUserAndId(user, deviceId);
            return true;
        }
        return false;
    }

    public List<DeviceDto> searchUserDevices(String userId, String searchTerm) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        return deviceRepository.searchDevicesByUser(user, searchTerm)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DeviceDto> getUserDevicesByStatus(String userId, Device.DeviceStatus status) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        return deviceRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DeviceDto> getLowBatteryDevices(String userId, Integer threshold) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        
        return deviceRepository.findLowBatteryDevicesByUser(user, threshold)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public DeviceDto updateDeviceStatus(String userId, String deviceId, Device.DeviceStatus status) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Device device = deviceRepository.findByUserAndId(user, deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found"));

        device.setStatus(status);
        device.setLastSeen(Instant.now());
        
        Device savedDevice = deviceRepository.save(device);
        
        // Log status change
        DeviceLog log = new DeviceLog(savedDevice, DeviceLog.LogLevel.INFO, 
                "Device status changed to " + status.name());
        deviceLogRepository.save(log);

        return convertToDto(savedDevice);
    }

    public DeviceDto updateDeviceBattery(String userId, String deviceId, Integer battery) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Device device = deviceRepository.findByUserAndId(user, deviceId)
                .orElseThrow(() -> new IllegalArgumentException("Device not found"));

        device.setBattery(battery);
        device.setLastSeen(Instant.now());
        
        Device savedDevice = deviceRepository.save(device);
        
        // Log battery update
        DeviceLog log = new DeviceLog(savedDevice, DeviceLog.LogLevel.INFO, 
                "Battery level updated to " + battery + "%");
        deviceLogRepository.save(log);

        return convertToDto(savedDevice);
    }

    private DeviceDto convertToDto(Device device) {
        DeviceDto dto = new DeviceDto();
        dto.setId(device.getId());
        dto.setName(device.getName());
        dto.setType(device.getType());
        dto.setStatus(device.getStatus().name());
        dto.setBattery(device.getBattery());
        dto.setLocation(device.getLocation());
        dto.setTasks(device.getTasks());
        dto.setOnline(device.isOnline());
        dto.setLastSeen(device.getLastSeen());
        dto.setCreatedAt(device.getCreatedAt());
        dto.setUpdatedAt(device.getUpdatedAt());
        
        // Convert logs
        if (device.getLogs() != null) {
            dto.setLogs(device.getLogs().stream()
                    .map(this::convertLogToDto)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    private DeviceDto.DeviceLogDto convertLogToDto(DeviceLog log) {
        DeviceDto.DeviceLogDto dto = new DeviceDto.DeviceLogDto();
        dto.setId(log.getId());
        dto.setLevel(log.getLevel().name());
        dto.setMessage(log.getMessage());
        dto.setDetails(log.getDetails());
        dto.setTimestamp(log.getTimestamp());
        return dto;
    }

    private Device convertToEntity(DeviceDto dto) {
        Device device = new Device();
        device.setName(dto.getName());
        device.setType(dto.getType());
        if (dto.getStatus() != null) {
            device.setStatus(Device.DeviceStatus.valueOf(dto.getStatus()));
        }
        device.setBattery(dto.getBattery());
        device.setLocation(dto.getLocation());
        device.setTasks(dto.getTasks());
        device.setOnline(dto.isOnline());
        return device;
    }

    private void updateDeviceFields(Device device, DeviceDto dto) {
        if (dto.getName() != null) device.setName(dto.getName());
        if (dto.getType() != null) device.setType(dto.getType());
        if (dto.getStatus() != null) device.setStatus(Device.DeviceStatus.valueOf(dto.getStatus()));
        if (dto.getBattery() != null) device.setBattery(dto.getBattery());
        if (dto.getLocation() != null) device.setLocation(dto.getLocation());
        if (dto.getTasks() != null) device.setTasks(dto.getTasks());
        device.setOnline(dto.isOnline());
        device.setLastSeen(Instant.now());
    }
}
