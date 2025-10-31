package com.customo.backend.controller;

import com.customo.backend.entity.Device;
import com.customo.backend.entity.DeviceLog;
import com.customo.backend.repository.DeviceLogRepository;
import com.customo.backend.repository.DeviceRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Controller
public class DeviceMonitoringController {

    private final SimpMessagingTemplate messagingTemplate;
    private final DeviceRepository deviceRepository;
    private final DeviceLogRepository deviceLogRepository;

    public DeviceMonitoringController(SimpMessagingTemplate messagingTemplate,
                                      DeviceRepository deviceRepository,
                                      DeviceLogRepository deviceLogRepository) {
        this.messagingTemplate = messagingTemplate;
        this.deviceRepository = deviceRepository;
        this.deviceLogRepository = deviceLogRepository;
    }

    @MessageMapping("/device/update")
    @SendTo("/topic/device-updates")
    public Map<String, Object> handleDeviceUpdate(Map<String, Object> update) {
        String deviceId = (String) update.get("deviceId");
        Integer battery = (Integer) update.get("battery");
        Boolean online = (Boolean) update.get("online");

        Device device = deviceRepository.findById(deviceId).orElse(null);
        if (device != null) {
            if (battery != null) {
                device.setBattery(battery);
            }
            if (online != null) {
                device.setOnline(online);
            }
            device.setLastSeen(Instant.now());
            deviceRepository.save(device);

            // Log the update
            DeviceLog log = new DeviceLog(device, DeviceLog.LogLevel.INFO, "Device status updated");
            deviceLogRepository.save(log);

            // Broadcast update
            Map<String, Object> response = new HashMap<>();
            response.put("deviceId", deviceId);
            response.put("battery", device.getBattery());
            response.put("online", device.isOnline());
            response.put("lastSeen", device.getLastSeen());

            messagingTemplate.convertAndSend("/topic/device-updates", response);
            return response;
        }
        return Map.of("error", "Device not found");
    }
}
