# ChatGPT Clone - Professional AI Assistant Application

A full-stack, production-ready ChatGPT-style web application built with Vue.js, Node.js, Express, and Firebase. Features include user authentication, persistent conversation history, subscription management, and a beautiful, responsive UI.

![ChatGPT Clone](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=ChatGPT+Clone)

## 🚀 Features

### Core Functionality
- **AI Chat Interface**: ChatGPT-style conversation interface with streaming responses
- **User Authentication**: Complete auth system with JWT tokens, email verification, and password reset
- **Conversation Management**: Persistent chat history with conversation organization
- **Real-time Streaming**: Server-sent events for real-time AI responses
- **Markdown Support**: Rich text rendering for code blocks, links, and formatting

### User Management
- **Email Verification**: Secure email verification workflow
- **Password Reset**: Forgot password functionality with email tokens
- **Profile Management**: User profile updates and settings
- **Usage Tracking**: Credit system with monthly limits for free users

### Security & Performance
- **Rate Limiting**: Comprehensive rate limiting to prevent abuse
- **Input Validation**: Server-side validation and sanitization
- **CORS Protection**: Properly configured cross-origin resource sharing
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Content Moderation**: OpenAI moderation API integration

### Subscription System
- **Free Tier**: 50 messages per month with basic AI model
- **Premium Tier**: Unlimited messages with advanced AI model
- **Usage Analytics**: Track and display user usage statistics

## 🛠 Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Client-side routing
- **Pinia** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Firestore** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **OpenAI API** - AI language model integration
- **Nodemailer** - Email service
- **Winston** - Logging library

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container deployment
- **Nginx** - Reverse proxy and static file serving
- **GitHub Actions** - CI/CD pipeline (ready)

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Docker** and **Docker Compose** (for containerized deployment)
- **Firebase** project with Firestore enabled
- **OpenAI API** key
- **Email service** credentials (Gmail, SendGrid, etc.)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chatgpt-clone
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env.local
```

### 4. Environment Configuration

Edit `backend/.env` with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 5. Run Development Servers

#### Option A: Run Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Option B: Run Concurrently
```bash
# From project root
npm install
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/v1/health

## 🐳 Docker Deployment

### Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

1. **Update environment variables** for production
2. **Set up SSL certificates** in the `ssl/` directory
3. **Configure domain names** in nginx configuration
4. **Deploy with Docker Compose**:

```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Extract the required fields for your `.env` file

### OpenAI Setup

1. Sign up at https://platform.openai.com
2. Generate an API key
3. Add the key to your `.env` file

### Email Service Setup

#### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in your `.env` file

#### SendGrid Setup
1. Sign up at SendGrid
2. Create an API key
3. Update email configuration in `.env`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/verify-email` | Verify email address |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/chat/message` | Send chat message |
| POST | `/api/v1/chat/stream` | Send streaming message |
| GET | `/api/v1/chat/conversations` | Get user conversations |
| GET | `/api/v1/chat/conversations/:id` | Get specific conversation |
| PUT | `/api/v1/chat/conversations/:id` | Update conversation |
| DELETE | `/api/v1/chat/conversations/:id` | Delete conversation |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user/profile` | Get user profile |
| PUT | `/api/v1/user/profile` | Update user profile |
| POST | `/api/v1/user/change-password` | Change password |
| GET | `/api/v1/user/usage` | Get usage statistics |
| GET | `/api/v1/user/settings` | Get user settings |
| PUT | `/api/v1/user/settings` | Update user settings |

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment Options

### 1. Vercel + Render

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Backend (Render):**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables
4. Deploy

### 2. Netlify + Railway

**Frontend (Netlify):**
```bash
# Build and deploy
cd frontend
npm run build
npx netlify deploy --prod --dir=dist
```

**Backend (Railway):**
1. Connect GitHub repository
2. Set environment variables
3. Deploy with Railway CLI

### 3. AWS/GCP/Azure

Use the provided Docker containers for deployment on cloud platforms:

```bash
# Build production images
docker build -t chatgpt-clone-backend ./backend
docker build -t chatgpt-clone-frontend ./frontend

# Push to container registry
# Deploy using your preferred cloud service
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Change all default secrets and API keys
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable request logging and monitoring
- [ ] Configure firewall rules
- [ ] Set up backup strategy for database
- [ ] Implement proper error handling
- [ ] Enable security headers
- [ ] Regular dependency updates

### Environment Variables Security

- Never commit `.env` files to version control
- Use different secrets for different environments
- Rotate API keys and secrets regularly
- Use environment-specific configurations

## 📊 Monitoring & Analytics

### Application Monitoring

The application includes:
- **Winston logging** with different log levels
- **Health check endpoints** for monitoring
- **Request/response logging** with timing
- **Error tracking** with stack traces

### Usage Analytics

- User registration and login tracking
- Message count and usage statistics
- Conversation analytics
- Error rate monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Q: Firebase connection fails**
A: Check your Firebase configuration and ensure Firestore is enabled

**Q: OpenAI API errors**
A: Verify your API key and check rate limits

**Q: Email sending fails**
A: Check SMTP settings and authentication credentials

**Q: CORS errors in development**
A: Ensure frontend and backend URLs are correctly configured

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review the documentation
- Check logs for error messages
- Verify environment configuration

## 🎯 Roadmap

### Upcoming Features

- [ ] Mobile app (React Native)
- [ ] Voice chat functionality
- [ ] File upload and analysis
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Plugin system
- [ ] Advanced AI model selection

### Performance Improvements

- [ ] Response caching
- [ ] Database query optimization
- [ ] CDN integration
- [ ] Image optimization
- [ ] Progressive Web App features

## 👥 Team

- **Backend Development**: Node.js, Express, Firebase
- **Frontend Development**: Vue.js, Tailwind CSS
- **DevOps**: Docker, CI/CD, Cloud deployment
- **Design**: UI/UX, Responsive design

---

**Built with ❤️ using modern web technologies**

For more information, visit our [documentation](./docs/) or check out the [API reference](./docs/api.md).