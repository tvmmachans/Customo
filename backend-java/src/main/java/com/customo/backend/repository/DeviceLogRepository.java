package com.customo.backend.repository;

import com.customo.backend.entity.Device;
import com.customo.backend.entity.DeviceLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface DeviceLogRepository extends JpaRepository<DeviceLog, String> {
    
    List<DeviceLog> findByDeviceOrderByTimestampDesc(Device device);
    
    Page<DeviceLog> findByDeviceOrderByTimestampDesc(Device device, Pageable pageable);
    
    List<DeviceLog> findByDeviceAndLevelOrderByTimestampDesc(Device device, DeviceLog.LogLevel level);
    
    @Query("SELECT dl FROM DeviceLog dl WHERE dl.device.user.id = :userId ORDER BY dl.timestamp DESC")
    List<DeviceLog> findByUserIdOrderByTimestampDesc(@Param("userId") String userId);
    
    @Query("SELECT dl FROM DeviceLog dl WHERE dl.device.user.id = :userId ORDER BY dl.timestamp DESC")
    Page<DeviceLog> findByUserIdOrderByTimestampDesc(@Param("userId") String userId, Pageable pageable);
    
    @Query("SELECT dl FROM DeviceLog dl WHERE dl.device.user.id = :userId AND dl.level = :level ORDER BY dl.timestamp DESC")
    List<DeviceLog> findByUserIdAndLevelOrderByTimestampDesc(@Param("userId") String userId, @Param("level") DeviceLog.LogLevel level);
    
    @Query("SELECT dl FROM DeviceLog dl WHERE dl.device.user.id = :userId AND dl.timestamp >= :startTime AND dl.timestamp <= :endTime ORDER BY dl.timestamp DESC")
    List<DeviceLog> findByUserIdAndDateRange(@Param("userId") String userId, @Param("startTime") Instant startTime, @Param("endTime") Instant endTime);
    
    @Query("SELECT COUNT(dl) FROM DeviceLog dl WHERE dl.device.user.id = :userId AND dl.level = :level")
    Long countByUserIdAndLevel(@Param("userId") String userId, @Param("level") DeviceLog.LogLevel level);
    
    void deleteByDevice(Device device);
}
