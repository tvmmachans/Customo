# 🚀 Quick Setup Guide

Follow these steps to get your Customo backend running in minutes!

## Prerequisites

- Node.js (v14 or higher)
- MySQL server
- Git

## Step 1: Database Setup

1. **Install MySQL** (if not already installed)
   - Windows: Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - macOS: `brew install mysql`
   - Ubuntu: `sudo apt install mysql-server`

2. **Create Database**
   ```sql
   mysql -u root -p
   CREATE DATABASE customo_db;
   exit
   ```

3. **Import Schema**
   ```bash
   mysql -u root -p customo_db < models/db.sql
   ```

## Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend-clean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=customo_db
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Initialize database**
   ```bash
   npm run init
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## Step 3: Test the API

1. **Run automated tests**
   ```bash
   npm test
   ```

2. **Manual testing with curl**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Register user
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   
   # Get products
   curl http://localhost:5000/api/products
   ```

## Step 4: Connect Frontend

Update your frontend to use these endpoints:

- **Base URL**: `http://localhost:5000`
- **Auth endpoints**: `/api/auth/*`
- **Product endpoints**: `/api/products/*`

## 🎯 What You Get

✅ **User Authentication**
- Signup with email validation
- Login with JWT tokens
- Secure password hashing

✅ **Product Management**
- List all products
- View product details
- CRUD operations (for testing)

✅ **Clean Architecture**
- Organized controllers and routes
- Middleware for authentication
- Error handling

✅ **Sample Data**
- 8 pre-loaded robot products
- Ready for immediate testing

## 🔧 Troubleshooting

**Database Connection Issues:**
- Check MySQL is running: `sudo service mysql status`
- Verify credentials in `.env` file
- Ensure database exists: `SHOW DATABASES;`

**Port Already in Use:**
- Change PORT in `.env` file
- Kill process: `lsof -ti:5000 | xargs kill -9`

**Permission Errors:**
- Check file permissions
- Run with sudo if needed (not recommended for production)

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify all environment variables
3. Ensure MySQL is running
4. Check the README.md for detailed documentation

Happy coding! 🚀
