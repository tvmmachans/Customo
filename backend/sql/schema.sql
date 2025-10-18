-- MySQL schema for Customo backend
-- Run this file against your MySQL server to create all tables

CREATE DATABASE IF NOT EXISTS `customo_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `customo_db`;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NULL,
  last_name VARCHAR(100) NULL,
  phone VARCHAR(50) NULL,
  company VARCHAR(100) NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DOUBLE NOT NULL,
  original_price DOUBLE NULL,
  category VARCHAR(50) NOT NULL,
  images TEXT NOT NULL,
  specifications JSON NULL,
  features TEXT NOT NULL,
  in_stock TINYINT(1) NOT NULL DEFAULT 1,
  stock_count INT NOT NULL DEFAULT 0,
  rating DOUBLE NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  badge VARCHAR(100) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS devices (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE',
  battery INT NOT NULL DEFAULT 100,
  location VARCHAR(255) NULL,
  last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_online TINYINT(1) NOT NULL DEFAULT 0,
  tasks TEXT NULL,
  user_id CHAR(36) NOT NULL,
  product_id CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_device_user (user_id),
  KEY idx_device_product (product_id),
  CONSTRAINT fk_device_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_device_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) NOT NULL,
  order_number VARCHAR(100) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  total_amount DOUBLE NOT NULL,
  shipping_address JSON NOT NULL,
  billing_address JSON NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  payment_intent_id VARCHAR(191) NULL,
  tracking_number VARCHAR(191) NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_user (user_id),
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id CHAR(36) NOT NULL,
  order_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price DOUBLE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_item_order (order_id),
  KEY idx_item_product (product_id),
  CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS service_tickets (
  id CHAR(36) NOT NULL,
  ticket_number VARCHAR(100) NOT NULL UNIQUE,
  user_id CHAR(36) NOT NULL,
  device_id CHAR(36) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  issue_type VARCHAR(100) NOT NULL,
  assigned_to VARCHAR(100) NULL,
  scheduled_date DATETIME NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_user (user_id),
  KEY idx_ticket_device (device_id),
  CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_ticket_device FOREIGN KEY (device_id) REFERENCES devices(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS custom_builds (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  design_files TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  total_cost DOUBLE NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_build_user (user_id),
  CONSTRAINT fk_build_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS custom_build_parts (
  id CHAR(36) NOT NULL,
  build_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  quantity INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_part_build (build_id),
  KEY idx_part_product (product_id),
  CONSTRAINT fk_part_build FOREIGN KEY (build_id) REFERENCES custom_builds(id) ON DELETE CASCADE,
  CONSTRAINT fk_part_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviews (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  rating INT NOT NULL,
  title VARCHAR(255) NULL,
  comment TEXT NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_user_product (user_id, product_id),
  KEY idx_review_product (product_id),
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS carts (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart_items (
  id CHAR(36) NOT NULL,
  cart_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  name VARCHAR(255) NULL,
  price DOUBLE NOT NULL DEFAULT 0,
  quantity INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cart_item_cart (cart_id),
  KEY idx_cart_item_product (product_id),
  CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_item_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


