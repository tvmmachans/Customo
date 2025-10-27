package com.customo.backend.repository;

import com.customo.backend.entity.Device;
import com.customo.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    
    List<Device> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Device> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Device> findByUserAndStatusOrderByCreatedAtDesc(User user, Device.DeviceStatus status);
    
    List<Device> findByUserAndIsOnlineOrderByLastSeenDesc(User user, boolean isOnline);
    
    @Query("SELECT d FROM Device d WHERE d.user = :user AND " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.type) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Device> searchDevicesByUser(@Param("user") User user, @Param("searchTerm") String searchTerm);
    
    @Query("SELECT COUNT(d) FROM Device d WHERE d.user = :user")
    Long countByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(d) FROM Device d WHERE d.user = :user AND d.isOnline = true")
    Long countOnlineByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(d) FROM Device d WHERE d.user = :user AND d.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") Device.DeviceStatus status);
    
    @Query("SELECT d FROM Device d WHERE d.user = :user AND d.battery < :threshold ORDER BY d.battery ASC")
    List<Device> findLowBatteryDevicesByUser(@Param("user") User user, @Param("threshold") Integer threshold);
    
    @Query("SELECT d FROM Device d WHERE d.user = :user AND d.lastSeen < :cutoffTime ORDER BY d.lastSeen ASC")
    List<Device> findOfflineDevicesByUser(@Param("user") User user, @Param("cutoffTime") Instant cutoffTime);
    
    Optional<Device> findByUserAndId(User user, String deviceId);
    
    void deleteByUserAndId(User user, String deviceId);
}
