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
- **Modern Frontend**: React 18 + TypeScript + Vite
- **Professional Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Communication**: WebSocket integration
- **Authentication**: JWT-based secure authentication
- **Payment Processing**: Stripe integration
- **File Upload**: Cloudinary integration
- **Email Notifications**: Automated email system
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

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Multer** - File upload handling

### Development Tools
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/customo-robotics-hub.git
   cd customo-robotics-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your database and service configurations
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Manual Setup

1. **Start the backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
customo-robotics-hub/
├── src/                          # Frontend source code
│   ├── components/              # Reusable components
│   │   ├── ui/                 # UI component library
│   │   ├── ErrorBoundary.tsx   # Error handling
│   │   ├── LoadingSpinner.tsx  # Loading states
│   │   └── NotificationProvider.tsx # Notifications
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and API client
│   ├── pages/                  # Page components
│   └── test/                   # Test files
├── backend/                     # Backend source code
│   ├── src/                    # Backend source
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   └── services/           # Business logic
│   ├── prisma/                 # Database schema and migrations
│   └── Dockerfile              # Backend containerization
├── public/                      # Static assets
├── docs/                       # Documentation
└── tests/                      # Test files
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Customo RoBo
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/customo_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:8080"
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm run test

# Backend tests
cd backend
npm run test

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
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/:id/reviews` - Get product reviews

### Device Endpoints
- `GET /api/devices` - Get user devices
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Add new device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `POST /api/devices/:id/control` - Control device

### Service Endpoints
- `GET /api/service/tickets` - Get service tickets
- `POST /api/service/tickets` - Create service ticket
- `PUT /api/service/tickets/:id` - Update ticket
- `GET /api/service/stats` - Get service statistics

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup
1. Configure production environment variables
2. Set up PostgreSQL database
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write comprehensive tests
- Use conventional commit messages
- Follow the existing code style
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Project Wiki](https://github.com/your-username/customo-robotics-hub/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/customo-robotics-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/customo-robotics-hub/discussions)
- **Email**: support@customorobo.com

## 🎯 Roadmap

### Version 1.1
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Advanced device automation

### Version 1.2
- [ ] Multi-tenant architecture
- [ ] Advanced reporting
- [ ] Third-party integrations
- [ ] Performance optimizations

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first approach
- Radix UI for accessible components
- All contributors and supporters

---

**Built with ❤️ by the Customo RoBo Team**
