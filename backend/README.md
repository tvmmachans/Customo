# Customo RoBo Backend API

A comprehensive backend API for the Customo RoBo robotics platform, built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Product Catalog Management** - Full CRUD operations for products, categories, and inventory
- **Device Management** - Real-time device monitoring and control
- **Order Processing** - Complete e-commerce functionality with Stripe integration
- **Service Ticketing System** - Customer support and maintenance tracking
- **Custom Build Platform** - Interactive robot builder with component selection
- **File Upload System** - Cloudinary integration for design files and images
- **Real-time Communication** - WebSocket support for live device monitoring
- **Email Notifications** - Automated email system for orders, tickets, and alerts

### Technical Features
- **TypeScript** - Full type safety and better development experience
- **Prisma ORM** - Type-safe database operations with PostgreSQL
- **JWT Authentication** - Secure token-based authentication
- **Stripe Payment Processing** - Complete payment integration with webhooks
- **Cloudinary File Storage** - Scalable file upload and management
- **Socket.IO** - Real-time bidirectional communication
- **Nodemailer** - Email service with HTML templates
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Centralized error management
- **Security** - Helmet.js security headers and CORS protection

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Redis (optional, for caching)
- Cloudinary account (for file uploads)
- Stripe account (for payments)
- SMTP email service (Gmail, SendGrid, etc.)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/customo_db"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=5000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # Email
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   FROM_EMAIL="noreply@customorobo.com"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Product Endpoints
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/:id/reviews` - Get product reviews

### Device Management
- `GET /api/devices` - Get user's devices
- `GET /api/devices/:id` - Get single device
- `POST /api/devices` - Add new device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `POST /api/devices/:id/control` - Control device
- `GET /api/devices/stats/overview` - Device statistics

### Order Management
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/shipping-address` - Update shipping address
- `GET /api/orders/:id/tracking` - Track order

### Payment Processing
- `POST /api/payment/create-payment-intent` - Create payment intent
- `POST /api/payment/confirm-payment` - Confirm payment
- `POST /api/payment/create-order` - Create order
- `POST /api/payment/webhook` - Stripe webhook handler
- `POST /api/payment/refund` - Process refund

### Service Tickets
- `GET /api/service/tickets` - Get user tickets
- `GET /api/service/tickets/:id` - Get single ticket
- `POST /api/service/tickets` - Create ticket
- `PUT /api/service/tickets/:id` - Update ticket
- `PUT /api/service/tickets/:id/cancel` - Cancel ticket
- `GET /api/service/admin/tickets` - Get all tickets (Admin/Technician)
- `PUT /api/service/admin/tickets/:id/assign` - Assign ticket
- `PUT /api/service/admin/tickets/:id/status` - Update ticket status

### Custom Builds
- `GET /api/custom-build` - Get user builds
- `GET /api/custom-build/:id` - Get single build
- `POST /api/custom-build` - Create build
- `PUT /api/custom-build/:id` - Update build
- `POST /api/custom-build/:id/request-quote` - Request quote
- `PUT /api/custom-build/:id/cancel` - Cancel build
- `DELETE /api/custom-build/:id` - Delete build

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `POST /api/upload/design` - Upload design files
- `DELETE /api/upload/:publicId` - Delete file
- `GET /api/upload/files` - Get user files
- `GET /api/upload/info/:publicId` - Get file info
- `POST /api/upload/signed-url` - Generate signed upload URL

## 🔌 WebSocket Events

### Client Events
- `join-device-monitoring` - Join device monitoring room
- `device-control` - Send device control commands
- `update-battery` - Update device battery level
- `update-location` - Update device location
- `join-service-monitoring` - Join service ticket monitoring

### Server Events
- `device-status-update` - Device status changed
- `battery-update` - Battery level updated
- `location-update` - Location updated
- `low-battery-alert` - Low battery warning
- `service-ticket-update` - Service ticket status changed

## 🗄️ Database Schema

### Core Models
- **User** - User accounts with role-based access
- **Product** - Product catalog with categories and inventory
- **Device** - User devices with real-time status
- **Order** - E-commerce orders with payment tracking
- **OrderItem** - Order line items
- **ServiceTicket** - Support and maintenance tickets
- **CustomBuild** - Custom robot builds
- **CustomBuildPart** - Build components
- **Review** - Product reviews and ratings

### Enums
- **UserRole** - CUSTOMER, ADMIN, TECHNICIAN, SUPPORT
- **ProductCategory** - SECURITY, ASSISTANT, INDUSTRIAL, DRONE, COMPONENT
- **DeviceStatus** - ACTIVE, IDLE, MAINTENANCE, OFFLINE, ERROR
- **OrderStatus** - PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- **PaymentStatus** - PENDING, PAID, FAILED, REFUNDED
- **TicketStatus** - OPEN, IN_PROGRESS, SCHEDULED, COMPLETED, CANCELLED
- **Priority** - LOW, MEDIUM, HIGH, URGENT
- **BuildStatus** - DRAFT, QUOTE_REQUESTED, APPROVED, IN_PRODUCTION, COMPLETED, CANCELLED

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Admin, Technician, Customer roles
- **Rate Limiting** - API protection against abuse
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers
- **Password Hashing** - bcrypt with salt rounds
- **SQL Injection Protection** - Prisma ORM protection

## 📧 Email Templates

- Welcome email for new users
- Order confirmation and shipping notifications
- Service ticket creation and updates
- Custom build quote requests
- Password reset emails
- Low battery alerts
- Newsletter templates

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
STRIPE_SECRET_KEY=sk_live_...
CLOUDINARY_CLOUD_NAME=your-production-cloud
SMTP_HOST=your-production-smtp
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use production database
- [ ] Configure production email service
- [ ] Set up Stripe webhook endpoints
- [ ] Configure Cloudinary for production
- [ ] Set up monitoring and logging
- [ ] Configure SSL certificates
- [ ] Set up backup strategies

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Database connection monitoring
- Email service status
- Stripe webhook monitoring
- Socket.IO connection tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@customorobo.com
- Documentation: [API Docs](https://docs.customorobo.com)
- Issues: [GitHub Issues](https://github.com/customorobo/backend/issues)

---

**Customo RoBo Backend** - Powering the future of robotics! 🤖
