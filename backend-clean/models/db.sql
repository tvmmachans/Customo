-- MySQL Database Schema for Customo Backend
-- Run this file against your MySQL server to create the necessary tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `customo_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `customo_db`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample products for testing
INSERT INTO `products` (`name`, `price`, `description`, `image_url`) VALUES
('Security Robot Pro', 2999.99, 'Advanced security robot with AI-powered surveillance and 24/7 monitoring capabilities.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500'),
('Assistant Bot', 1999.99, 'Smart assistant robot that helps with daily tasks and home automation.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Industrial Robot Arm', 4999.99, 'Heavy-duty industrial robot arm for manufacturing and assembly operations.', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500'),
('Drone Surveillance', 1299.99, 'High-tech surveillance drone with HD camera and GPS tracking.', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500'),
('Robot Components Kit', 299.99, 'Complete kit of essential components for building custom robots.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500'),
('Smart Home Controller', 599.99, 'Central controller for managing all your smart home devices and robots.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Cleaning Robot', 899.99, 'Autonomous cleaning robot with advanced navigation and scheduling.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Educational Robot Kit', 199.99, 'Fun and educational robot kit perfect for learning robotics basics.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500');

-- Create indexes for better performance
CREATE INDEX `idx_users_email` ON `users` (`email`);
CREATE INDEX `idx_products_name` ON `products` (`name`);
CREATE INDEX `idx_products_price` ON `products` (`price`);
