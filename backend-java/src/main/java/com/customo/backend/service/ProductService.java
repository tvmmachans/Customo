package com.customo.backend.service;

import com.customo.backend.dto.ProductDto;
import com.customo.backend.entity.Product;
import com.customo.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable)
                .map(this::convertToDto);
    }

    public Optional<ProductDto> getProductById(String id) {
        return productRepository.findById(id)
                .filter(Product::isActive)
                .map(this::convertToDto);
    }

    public List<ProductDto> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndIsActiveTrue(category)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getProductsByBrand(String brand) {
        return productRepository.findByBrandAndIsActiveTrue(brand)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Page<ProductDto> searchProducts(String searchTerm, Pageable pageable) {
        return productRepository.searchProducts(searchTerm, pageable)
                .map(this::convertToDto);
    }

    public List<String> getCategories() {
        return productRepository.findDistinctCategories();
    }

    public List<String> getBrands() {
        return productRepository.findDistinctBrands();
    }

    public ProductDto createProduct(ProductDto productDto) {
        Product product = convertToEntity(productDto);
        product.setActive(true);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    public Optional<ProductDto> updateProduct(String id, ProductDto productDto) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    updateProductFields(existingProduct, productDto);
                    Product savedProduct = productRepository.save(existingProduct);
                    return convertToDto(savedProduct);
                });
    }

    public boolean deleteProduct(String id) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setActive(false);
                    productRepository.save(product);
                    return true;
                })
                .orElse(false);
    }

    public List<ProductDto> getLowStockProducts(Integer threshold) {
        return productRepository.findByStockQuantityLessThanAndIsActiveTrue(threshold)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setCategory(product.getCategory());
        dto.setBrand(product.getBrand());
        dto.setImageUrl(product.getImageUrl());
        dto.setSku(product.getSku());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setActive(product.isActive());
        return dto;
    }

    private Product convertToEntity(ProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(dto.getCategory());
        product.setBrand(dto.getBrand());
        product.setImageUrl(dto.getImageUrl());
        product.setSku(dto.getSku());
        product.setRating(dto.getRating());
        product.setReviewCount(dto.getReviewCount());
        return product;
    }

    private void updateProductFields(Product product, ProductDto dto) {
        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) product.setStockQuantity(dto.getStockQuantity());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());
        if (dto.getBrand() != null) product.setBrand(dto.getBrand());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getSku() != null) product.setSku(dto.getSku());
        if (dto.getRating() != null) product.setRating(dto.getRating());
        if (dto.getReviewCount() != null) product.setReviewCount(dto.getReviewCount());
    }
}
