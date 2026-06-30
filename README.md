# Ticket System 🎫

A full-stack ticket management system built with Angular frontend, Node.js/Express backend, and MySQL database.

## 🌐 Live Demo

**Live Application:** _Coming Soon - Currently runs locally_  
**Local Demo:** `docker compose up --build` → http://localhost:8080
**API Health Check:** http://localhost:3000/health

## 📊 Project Highlights

- Built full-stack ticket management system
- Implemented RESTful API with Express.js
- Created responsive Angular frontend
- Used Docker for containerization
- Set up MySQL database with migrations
- Implemented health checks and monitoring

## 🚀 Features

- Create and manage support tickets
- Comment system for ticket discussions
- User roles (USER, AGENT, ADMIN)
- Real-time ticket status updates
- RESTful API architecture
- Dockerized deployment

## 🛠 Tech Stack

- **Frontend**: Angular 18, TypeScript, CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (reverse proxy)

## 📋 Prerequisites

- Docker Desktop installed
- Git installed
- Node.js 20+ (for local development)

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd mein-ticket-system
   ```

2. **Set up environment variables**

   ```bash
   copy .env.example .env
   ```

3. **Start with Docker Compose**

   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - Health check: http://localhost:3000/health

## 🔧 Configuration Options

### Standard 3-Container Setup (Recommended)

```bash
docker compose up --build
```

- Separate containers for frontend, backend, and database
- Nginx reverse proxy
- Production-like architecture

### Single-Container Setup (Simplified)

```bash
docker compose -f docker-compose.single.yml up --build
```

- Everything served from port 3000
- Simpler deployment
- Good for development

## 🔒 HTTPS Setup (Production)

1. **Place SSL certificates in the certs folder:**
   - `certs/fullchain.pem`
   - `certs/privkey.pem`

2. **Generate self-signed certificates for testing:**

   ```bash
   mkdir -p certs
   openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
     -keyout certs/privkey.pem \
     -out certs/fullchain.pem \
     -subj "/CN=localhost"
   ```

3. **Start with HTTPS:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.ssl.yml up --build
   ```

## 🗄 Database Schema

The system includes:

- **Users table**: User management with roles
- **Tickets table**: Support tickets with status tracking
- **Comments table**: Ticket discussion threads

Initial data is seeded automatically on first run.

## 🧪 Testing

### Backend Testing (Jest)
The backend uses Jest for comprehensive testing with 11 passing tests:

```bash
cd ticket-system-backend
npm test                 # Run all Jest tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

**Backend Test Coverage:**
- **Data Validation**: Ticket structure, required fields, status values, user roles
- **Business Logic**: Status transitions, comment validation, email format
- **API Structure**: Endpoint format validation, HTTP methods
- **Utility Functions**: Timestamp generation, string trimming

### Frontend Testing (Node.js Standalone)
The frontend tests use a standalone Node.js approach with 12 passing tests:

```bash
cd ticket-system-frontend
node test-standalone.js  # Run all frontend tests (12 tests)
```

**Frontend Test Coverage:**
- **Model Validation**: User structure, email format, roles, ticket validation
- **Form Logic**: Login form, ticket form validation
- **State Management**: Authentication state, ticket filtering
- **API Configuration**: Endpoint building, error handling

### Total Test Coverage
- **Backend Tests**: 11 passing (Jest)
- **Frontend Tests**: 12 passing (Node.js)
- **Total Tests**: 23 passing tests
- **Coverage**: Complete validation, business logic, and API testing

### Test Reports
After running backend coverage:
```bash
cd ticket-system-backend
npm run test:coverage
open coverage/lcov-report/index.html  # View detailed coverage
```

### Continuous Integration
Both test suites are ready for CI/CD integration:
```bash
# Full test suite
npm run test:all         # Runs both backend and frontend tests
```

## 🔧 Development

### Local Development (without Docker)

1. **Backend setup:**

   ```bash
   cd ticket-system-backend
   npm install
   npm run build
   npm start
   ```

2. **Frontend setup:**

   ```bash
   cd ticket-system-frontend
   npm install
   npm run build
   # or for development: npm start
   ```

3. **Database setup:**
   - Install MySQL locally
   - Import scripts from `ticket-system-database/init-scripts/`

### API Endpoints

- `GET /api/tickets` - List all tickets
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket status
- `DELETE /api/tickets/:id` - Delete ticket
- `GET /api/tickets/:id/comments` - Get ticket comments
- `POST /api/tickets/:id/comments` - Add comment
- `POST /api/login` - User authentication
- `GET /health` - Health check

## 🚀 Deployment Options

### Docker Compose (Recommended)

Ready for production with proper container isolation and nginx proxy.

### PM2 (Node.js Process Manager)

```bash
cd ticket-system-backend
npm install
npm run build
npm run start:prod
```

### Cloud Deployment

- AWS ECS/Fargate with RDS
- Google Cloud Run with Cloud SQL
- Azure Container Instances with Azure Database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🐛 Troubleshooting

### Common Issues

**Port 3306 already in use:**

```bash
# Stop local MySQL or change port in docker-compose.yml
services:
  db:
    ports:
      - '3307:3306'  # Use different host port
```

**Backend can't connect to database:**

- Ensure database container is healthy
- Check environment variables in .env
- Verify Docker network connectivity

**Frontend not loading:**

- Check if nginx container is running
- Verify port 8080 is available
- Check browser console for errors

For more issues, check the GitHub Issues page.

## 🎯 **For Recruiters & Hiring Managers**

### **Technical Skills Demonstrated:**

- **Frontend:** Angular 18, TypeScript, Responsive Design, SPA Architecture
- **Backend:** Node.js, Express.js, RESTful APIs, TypeScript
- **Database:** MySQL, Database Design, SQL Queries, Data Relationships
- **DevOps:** Docker, Docker Compose, Container Orchestration, Health Checks
- **Architecture:** Microservices, Reverse Proxy (Nginx), API Gateway Pattern

### **Key Features Implemented:**

- ✅ User authentication & authorization
- ✅ CRUD operations for tickets and comments
- ✅ Role-based access control (USER/AGENT/ADMIN)
- ✅ Real-time status updates
- ✅ Containerized deployment
- ✅ Database relationships and foreign keys
- ✅ Error handling and validation
- ✅ API documentation and health monitoring

### **Production Readiness:**

- 🐳 **Dockerized** - Ready for cloud deployment
- 🔒 **Security** - Input validation, CORS configuration
- 📊 **Monitoring** - Health checks, structured logging
- 🚀 **Scalable** - Microservice architecture, stateless design
- 🔄 **CI/CD Ready** - Container-based deployment pipeline

### **Quick Start for Review:**

```bash
git clone https://github.com/YOUR_USERNAME/mein-ticket-system
cd mein-ticket-system
docker compose up --build
# Visit: http://localhost:8080
```

## 📧 **Contact**

- **LinkedIn:** https://www.linkedin.com/in/fawad-fullstack/
- **Portfolio:** https://github.com/Fawadperzad/fawad-perzad-portfolio
- **Email:** fawad.perzad86@gmail.com

---

_This project demonstrates full-stack development capabilities, modern deployment practices, and production-ready code suitable for enterprise environments._
