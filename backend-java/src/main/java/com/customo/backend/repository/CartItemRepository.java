package com.customo.backend.repository;

import com.customo.backend.entity.CartItem;
import com.customo.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    
    List<CartItem> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.user = :user ORDER BY ci.createdAt DESC")
    List<CartItem> findByUserWithProduct(@Param("user") User user);
    
    Optional<CartItem> findByUserAndProduct(User user, com.customo.backend.entity.Product product);
    
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.user = :user")
    Long countByUser(@Param("user") User user);
    
    @Query("SELECT SUM(ci.totalPrice) FROM CartItem ci WHERE ci.user = :user")
    Double sumTotalPriceByUser(@Param("user") User user);
    
    void deleteByUser(User user);
    
    void deleteByUserAndProduct(User user, com.customo.backend.entity.Product product);
}
