package com.customo.backend.controller;

import com.customo.backend.dto.ProductDto;
import com.customo.backend.service.ProductService;
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
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080"})
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductDto> products;
            
            if (search != null && !search.trim().isEmpty()) {
                products = productService.searchProducts(search, pageable);
            } else if (category != null && !category.trim().isEmpty()) {
                List<ProductDto> productList = productService.getProductsByCategory(category);
                response.put("success", true);
                response.put("data", Map.of(
                    "products", productList,
                    "totalElements", productList.size(),
                    "totalPages", 1,
                    "currentPage", 0,
                    "size", productList.size()
                ));
                return ResponseEntity.ok(response);
            } else if (brand != null && !brand.trim().isEmpty()) {
                List<ProductDto> productList = productService.getProductsByBrand(brand);
                response.put("success", true);
                response.put("data", Map.of(
                    "products", productList,
                    "totalElements", productList.size(),
                    "totalPages", 1,
                    "currentPage", 0,
                    "size", productList.size()
                ));
                return ResponseEntity.ok(response);
            } else {
                products = productService.getAllProducts(pageable);
            }
            
            response.put("success", true);
            response.put("data", Map.of(
                "products", products.getContent(),
                "totalElements", products.getTotalElements(),
                "totalPages", products.getTotalPages(),
                "currentPage", products.getNumber(),
                "size", products.getSize()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching products: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            return productService.getProductById(id)
                    .map(product -> {
                        response.put("success", true);
                        response.put("data", Map.of("product", product));
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        response.put("success", false);
                        response.put("message", "Product not found");
                        return ResponseEntity.status(404).body(response);
                    });
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching product: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategories() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<String> categories = productService.getCategories();
            response.put("success", true);
            response.put("data", Map.of("categories", categories));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching categories: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/brands")
    public ResponseEntity<Map<String, Object>> getBrands() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<String> brands = productService.getBrands();
            response.put("success", true);
            response.put("data", Map.of("brands", brands));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching brands: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@Valid @RequestBody ProductDto productDto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ProductDto createdProduct = productService.createProduct(productDto);
            response.put("success", true);
            response.put("data", Map.of("product", createdProduct));
            return ResponseEntity.status(201).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating product: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable String id, @Valid @RequestBody ProductDto productDto) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            return productService.updateProduct(id, productDto)
                    .map(product -> {
                        response.put("success", true);
                        response.put("data", Map.of("product", product));
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        response.put("success", false);
                        response.put("message", "Product not found");
                        return ResponseEntity.status(404).body(response);
                    });
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating product: " + e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean deleted = productService.deleteProduct(id);
            if (deleted) {
                response.put("success", true);
                response.put("message", "Product deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Product not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting product: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
