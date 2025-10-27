package com.customo.backend.controller;

import com.customo.backend.entity.CartItem;
import com.customo.backend.entity.Product;
import com.customo.backend.entity.User;
import com.customo.backend.repository.CartItemRepository;
import com.customo.backend.repository.ProductRepository;
import com.customo.backend.repository.UserRepository;
import com.customo.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCartItems(@RequestHeader(value = "Authorization", required = false) String auth) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtDesc(user);
            
            response.put("success", true);
            response.put("data", Map.of("cartItems", cartItems));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching cart items: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addToCart(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody Map<String, Object> requestBody) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            String productId = (String) requestBody.get("productId");
            Integer quantity = (Integer) requestBody.getOrDefault("quantity", 1);

            if (productId == null) {
                response.put("success", false);
                response.put("message", "Product ID is required");
                return ResponseEntity.status(400).body(response);
            }

            Product product = productRepository.findById(productId).orElse(null);
            if (product == null || !product.isActive()) {
                response.put("success", false);
                response.put("message", "Product not found or inactive");
                return ResponseEntity.status(404).body(response);
            }

            if (product.getStockQuantity() < quantity) {
                response.put("success", false);
                response.put("message", "Insufficient stock");
                return ResponseEntity.status(400).body(response);
            }

            // Check if item already exists in cart
            Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);
            
            CartItem cartItem;
            if (existingItem.isPresent()) {
                cartItem = existingItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            } else {
                cartItem = new CartItem(user, product, quantity, product.getPrice());
            }

            CartItem savedItem = cartItemRepository.save(cartItem);
            
            response.put("success", true);
            response.put("data", Map.of("cartItem", savedItem));
            response.put("message", "Item added to cart successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error adding item to cart: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<Map<String, Object>> updateCartItem(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String cartItemId,
            @RequestBody Map<String, Object> requestBody) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            Integer quantity = (Integer) requestBody.get("quantity");
            if (quantity == null || quantity < 1) {
                response.put("success", false);
                response.put("message", "Valid quantity is required");
                return ResponseEntity.status(400).body(response);
            }

            CartItem cartItem = cartItemRepository.findById(cartItemId).orElse(null);
            if (cartItem == null || !cartItem.getUser().getId().equals(userId)) {
                response.put("success", false);
                response.put("message", "Cart item not found");
                return ResponseEntity.status(404).body(response);
            }

            if (cartItem.getProduct().getStockQuantity() < quantity) {
                response.put("success", false);
                response.put("message", "Insufficient stock");
                return ResponseEntity.status(400).body(response);
            }

            cartItem.setQuantity(quantity);
            CartItem savedItem = cartItemRepository.save(cartItem);
            
            response.put("success", true);
            response.put("data", Map.of("cartItem", savedItem));
            response.put("message", "Cart item updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating cart item: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Map<String, Object>> removeFromCart(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @PathVariable String cartItemId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            CartItem cartItem = cartItemRepository.findById(cartItemId).orElse(null);
            if (cartItem == null || !cartItem.getUser().getId().equals(userId)) {
                response.put("success", false);
                response.put("message", "Cart item not found");
                return ResponseEntity.status(404).body(response);
            }

            cartItemRepository.delete(cartItem);
            
            response.put("success", true);
            response.put("message", "Item removed from cart successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error removing item from cart: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> clearCart(@RequestHeader(value = "Authorization", required = false) String auth) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (auth == null || !auth.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "No token provided");
                return ResponseEntity.status(401).body(response);
            }

            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            cartItemRepository.deleteByUser(user);
            
            response.put("success", true);
            response.put("message", "Cart cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error clearing cart: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
