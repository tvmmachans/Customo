# Customo RoBo - Advanced Robotics Platform

![Customo RoBo Logo](https://via.placeholder.com/400x100/1f2937/ffffff?text=Customo+RoBo)

A comprehensive robotics platform for custom robot building, device management, and service automation. Built with modern web technologies and professional architecture.

## 🚀 Features

### Core Functionality
- **Custom Robot Building**: Design and build custom robots with our intuitive platform
- **Device Management**: Monitor and control your robotic devices in real-time
- **Service Automation**: Automated service scheduling and management
- **E-commerce Integration**: Complete shopping experience for robotics components
- **Real-time Monitoring**: Live device status and performance tracking

### Technical Features
- **Modern Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Professional Backend**: Spring Boot + Java 17 + JPA/Hibernate
- **Database**: H2 (development) / PostgreSQL (production)
- **Authentication**: JWT-based secure authentication
- **API Design**: RESTful APIs with proper error handling
- **Testing**: Comprehensive test suite with Vitest
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **Framer Motion** - Smooth animations

### Backend
- **Spring Boot 3.2.5** - Java web framework
- **Java 17** - Modern Java features
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM framework
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **H2 Database** - In-memory database (dev)
- **Maven** - Build tool

## 📁 Project Structure

```
customo-robotics-hub/
├── src/                          # Frontend source code
│   ├── components/              # Reusable components
│   │   ├── ui/                 # UI component library
│   │   ├── ErrorBoundary.tsx   # Error handling
│   │   ├── LoadingSpinner.tsx  # Loading states
│   │   └── NotificationProvider.tsx # Notifications
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication context
│   │   └── CartContext.tsx     # Shopping cart context
│   ├── services/               # API services
│   │   └── api.ts              # Main API client
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and API client
│   ├── pages/                  # Page components
│   └── test/                   # Test files
├── backend-java/               # Backend source code
│   ├── src/main/java/com/customo/backend/
│   │   ├── controller/         # REST controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── entity/           # JPA entities
│   │   ├── dto/              # Data transfer objects
│   │   ├── config/           # Configuration classes
│   │   └── util/             # Utility classes
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml               # Maven configuration
├── public/                     # Static assets
├── docs/                       # Documentation
└── tests/                      # Test files
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customo-robotics-hub
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the backend**
   ```bash
   cd backend-java
   mvn spring-boot:run
   ```

5. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api
   - H2 Console: http://localhost:8080/h2-console

### Using Docker (Alternative)

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

2. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8080/api

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Customo RoBo
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

#### Backend (application.properties)
```properties
# Database Configuration
spring.datasource.url=jdbc:h2:mem:customo;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver

# JWT Configuration
jwt.secret=your-super-secret-jwt-key-change-in-production
jwt.expiration=604800000

# Server Configuration
server.port=8080
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm run test

# Backend tests
cd backend-java
mvn test

# Test coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Product Endpoints
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/categories` - Get product categories
- `GET /api/products/brands` - Get product brands
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Cart Endpoints
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Device Endpoints
- `GET /api/devices` - Get user devices
- `GET /api/devices/{id}` - Get device by ID
- `POST /api/devices` - Add new device
- `PUT /api/devices/{id}` - Update device

### Health Check
- `GET /api/health` - Health check endpoint

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt password encryption
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation with Hibernate Validator
- **SQL Injection Protection**: JPA/Hibernate parameterized queries
- **XSS Protection**: Input sanitization and output encoding

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting service
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Backend Deployment
```bash
# Build JAR file
cd backend-java
mvn clean package

# Run JAR file
java -jar target/backend-java-0.0.1-SNAPSHOT.jar
```

### Production Considerations
- Use PostgreSQL instead of H2
- Set secure JWT secret
- Configure proper CORS origins
- Enable HTTPS
- Set up monitoring and logging
- Use environment variables for secrets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic authentication system
- ✅ Product catalog
- ✅ Shopping cart functionality
- ✅ Device management
- ✅ Responsive UI

### Phase 2 (Next)
- 🔄 Order management system
- 🔄 Payment integration (Stripe)
- 🔄 Real-time notifications
- 🔄 Advanced device monitoring
- 🔄 Admin dashboard

### Phase 3 (Future)
- 📋 Machine learning integration
- 📋 IoT device connectivity
- 📋 Advanced analytics
- 📋 Mobile app
- 📋 Multi-tenant support

---

**Built with ❤️ by the Customo Team**