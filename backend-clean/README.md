# Customo Backend - Clean Version

A clean, beginner-friendly Node.js + Express + MySQL backend for the Customo project.

## 🚀 Features

- **User Authentication**: Signup and login with JWT tokens
- **Product Management**: CRUD operations for products
- **Secure Password Hashing**: Using bcryptjs
- **Input Validation**: Email format and password length validation
- **Clean Architecture**: Organized controllers, routes, and middleware
- **MySQL Database**: Simple SQL queries without ORM complexity

## 📁 Project Structure

```
backend-clean/
├── server.js                 # Main server file
├── config/
│   └── db.js                # Database configuration and connection
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── productRoutes.js     # Product routes
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── productController.js # Product management logic
├── middleware/
│   ├── authMiddleware.js    # JWT authentication middleware
│   └── errorHandler.js      # Global error handling
├── models/
│   └── db.sql              # Database schema and sample data
├── package.json
├── env.example             # Environment variables template
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend-clean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your database credentials and JWT secret.

4. **Set up MySQL database**
   - Create a MySQL database named `customo_db`
   - Run the SQL schema file:
   ```bash
   mysql -u your_username -p customo_db < models/db.sql
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=customo_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

- **POST** `/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **GET** `/me` - Get current user (requires authentication)

### Product Routes (`/api/products`)

- **GET** `/` - Get all products
- **GET** `/:id` - Get product by ID
- **POST** `/` - Create new product (for testing)
- **PUT** `/:id` - Update product (for testing)
- **DELETE** `/:id` - Delete product (for testing)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Schema

### Users Table
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR(255))
- `email` (VARCHAR(255), Unique)
- `password` (VARCHAR(255), Hashed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Products Table
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR(255))
- `price` (DECIMAL(10,2))
- `description` (TEXT)
- `image_url` (VARCHAR(500))
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🧪 Testing the API

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get all products
```bash
curl http://localhost:5000/api/products
```

### 4. Get product by ID
```bash
curl http://localhost:5000/api/products/1
```

### 5. Get current user (with token)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "customo-backend"
   ```

## 📝 Notes

- This is a clean, simplified version focused on core functionality
- Password hashing uses bcryptjs with 12 salt rounds
- JWT tokens expire in 7 days by default
- All routes include proper error handling
- CORS is configured for frontend integration
- Rate limiting is implemented for security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
