# Customo RoBo Backend Deployment Guide

This guide covers deploying the Customo RoBo backend API to production environments.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Domain name configured (optional)
- SSL certificates (for production)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd backend
cp env.example .env
```

### 2. Configure Environment
Update `.env` with your production values:
```env
NODE_ENV=production
DATABASE_URL=postgresql://customo_user:customo_password@postgres:5432/customo_db
JWT_SECRET=your-super-secure-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
CLOUDINARY_CLOUD_NAME=your-production-cloud
SMTP_HOST=your-production-smtp
# ... other production values
```

### 3. Deploy with Docker Compose
```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Run database migrations
docker-compose exec api npm run db:migrate

# Seed database (optional)
docker-compose exec api npm run db:seed
```

## 🌐 Production Deployment Options

### Option 1: VPS/Cloud Server (Recommended)

#### Using DigitalOcean Droplet
1. **Create Droplet**
   - Ubuntu 22.04 LTS
   - 2GB RAM minimum (4GB recommended)
   - 50GB SSD storage

2. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd backend
   
   # Configure environment
   cp env.example .env
   nano .env  # Update with production values
   
   # Deploy
   docker-compose up -d
   ```

#### Using AWS EC2
1. **Launch EC2 Instance**
   - Amazon Linux 2 or Ubuntu 22.04
   - t3.medium or larger
   - Security group with ports 80, 443, 22

2. **Install Dependencies**
   ```bash
   # Install Docker
   sudo yum update -y
   sudo yum install -y docker
   sudo systemctl start docker
   sudo systemctl enable docker
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

### Option 2: Platform as a Service (PaaS)

#### Heroku Deployment
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create customo-backend
   heroku addons:create heroku-postgresql:hobby-dev
   heroku addons:create heroku-redis:hobby-dev
   ```

3. **Configure Environment**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set STRIPE_SECRET_KEY=sk_live_...
   # ... set other environment variables
   ```

4. **Deploy**
   ```bash
   git push heroku main
   heroku run npm run db:migrate
   heroku run npm run db:seed
   ```

#### Railway Deployment
1. **Connect Repository**
   - Go to Railway.app
   - Connect your GitHub repository
   - Select the backend folder

2. **Configure Services**
   - Add PostgreSQL database
   - Add Redis cache
   - Set environment variables

3. **Deploy**
   - Railway automatically builds and deploys
   - Run migrations in Railway console

### Option 3: Kubernetes (Advanced)

#### Using Google Cloud Platform
1. **Create GKE Cluster**
   ```bash
   gcloud container clusters create customo-cluster \
     --num-nodes=3 \
     --zone=us-central1-a \
     --machine-type=e2-medium
   ```

2. **Deploy with Helm**
   ```bash
   # Install Helm
   curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
   
   # Add PostgreSQL Helm chart
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install postgresql bitnami/postgresql
   
   # Deploy application
   kubectl apply -f k8s/
   ```

## 🔧 Production Configuration

### Environment Variables
```env
# Production Database
DATABASE_URL=postgresql://username:password@host:5432/database

# Security
JWT_SECRET=your-super-secure-jwt-secret-here
NODE_ENV=production

# External Services
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your-production-cloud
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com

# Redis (Optional)
REDIS_URL=redis://your-redis-host:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### SSL/TLS Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://api:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# Install PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start dist/index.js --name customo-api

# Monitor logs
pm2 logs customo-api

# Monitor performance
pm2 monit
```

### Database Monitoring
```sql
-- Monitor database connections
SELECT count(*) FROM pg_stat_activity;

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Log Management
```bash
# Install logrotate
sudo apt install logrotate

# Configure log rotation
sudo nano /etc/logrotate.d/customo-api
```

## 🔒 Security Best Practices

### 1. Environment Security
- Use strong, unique passwords
- Rotate secrets regularly
- Use environment-specific configurations
- Never commit secrets to version control

### 2. Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups
- Monitor for suspicious activity

### 3. API Security
- Rate limiting enabled
- CORS properly configured
- Input validation on all endpoints
- Regular security updates

### 4. Infrastructure Security
- Firewall configuration
- SSL/TLS certificates
- Regular security patches
- Access logging

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_devices_user_id ON devices(user_id);
```

### 2. Caching Strategy
```javascript
// Redis caching example
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache product data
const getProduct = async (id) => {
  const cached = await client.get(`product:${id}`);
  if (cached) return JSON.parse(cached);
  
  const product = await prisma.product.findUnique({ where: { id } });
  await client.setex(`product:${id}`, 3600, JSON.stringify(product));
  return product;
};
```

### 3. CDN Configuration
- Use CloudFront or similar CDN
- Cache static assets
- Enable gzip compression
- Optimize images

## 🚨 Backup and Recovery

### Database Backups
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Application Backups
```bash
# Backup application data
tar -czf app_backup_$(date +%Y%m%d).tar.gz /app/uploads
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app/customo-backend
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker-compose exec api npm run db:migrate
```

## 📞 Support and Maintenance

### Health Checks
- Monitor API endpoints
- Database connection status
- External service availability
- Disk space and memory usage

### Regular Maintenance
- Security updates
- Dependency updates
- Database optimization
- Log rotation
- Backup verification

### Troubleshooting
```bash
# Check application logs
docker-compose logs api

# Check database status
docker-compose exec postgres psql -U customo_user -d customo_db -c "SELECT 1;"

# Restart services
docker-compose restart api

# Scale services
docker-compose up -d --scale api=3
```

---

**Deployment Complete!** 🎉

Your Customo RoBo backend is now ready for production use. Monitor the application and scale as needed based on traffic and usage patterns.
