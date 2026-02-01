# 🚀 Multi-Tenant SaaS Starter Kit

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**Production-ready, full-stack multi-tenant SaaS starter kit** with authentication, roles, permissions, and beautiful UI.

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📸 Screenshots

### Landing Page
![Landing Page](./docs/screenshots/landing-page.png)
*Modern landing page with hero section, features, and tech stack*

### Authentication
![Login Page](./docs/screenshots/login-page.png)
*Clean login interface with password visibility toggle*

![Register Page](./docs/screenshots/register-page.png)
*Registration form with password strength indicator and tenant creation*

### Tenant Selection
![Select Tenant](./docs/screenshots/select-tanent.png)
*If a user has access to multiple tenants, they will be prompted to select which tenant to continue with after logging in. This determines which organization or workspace is active for the session.*

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)
*Main dashboard with sidebar navigation and placeholder content*

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ **JWT Authentication** - Access & refresh token pattern
- ✅ **Multi-Tenant Login** - Users can belong to multiple tenants
- ✅ **Tenant Selection** - Choose tenant after login
- ✅ **Secure Password Hashing** - bcrypt with salt rounds
- ✅ **Token Refresh** - Automatic token renewal
- ✅ **Logout & Revocation** - Redis-based token management

### 🏢 Multi-Tenant Architecture
- ✅ **Tenant Isolation** - Strict data separation
- ✅ **Multi-Tenant Users** - Users can join multiple companies
- ✅ **Tenant Scoped Data** - All resources are tenant-aware
- ✅ **Tenant Settings** - Per-tenant configuration

### 🎭 Roles & Permissions
- ✅ **Role-Based Access Control (RBAC)** - Flexible role system
- ✅ **Permission-Based Authorization** - Granular permissions
- ✅ **System Roles** - OWNER role with full access
- ✅ **Custom Roles** - Create tenant-specific roles
- ✅ **Permission Guards** - Declarative permission checks

### 👥 User Management
- ✅ **User Invitations** - Invite users to tenants
- ✅ **Team Management** - View and manage team members
- ✅ **Invitation System** - Accept/decline invitations
- ✅ **Role Assignment** - Assign roles to users

### 🎨 Frontend Features
- ✅ **Modern UI** - Built with Next.js, Tailwind CSS, Radix UI
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Protected Routes** - Route-level authentication
- ✅ **Real-time Updates** - Auto-refresh invitation count

### ⚡ Backend Features
- ✅ **RESTful API** - Clean API structure
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Database Migrations** - Prisma migrations
- ✅ **Redis Caching** - Token storage and caching
- ✅ **Docker Support** - Easy local development

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Redis** - In-memory data store
- **JWT** - JSON Web Tokens
- **Passport.js** - Authentication middleware
- **Docker** - Containerization

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- npm or yarn

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/saas-starter-kit.git
cd saas-starter-kit
```

### 2️⃣ Backend Setup

```bash
cd api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start PostgreSQL and Redis
docker compose up -d

# Run migrations
npx prisma generate
npx prisma migrate dev

# Start backend server
npm run start:dev
```

Backend will run on `http://localhost:3001`

### 3️⃣ Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4️⃣ Access Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

## 📁 Project Structure

```
starter-kit/
├── api/                    # Backend (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── roles/         # Roles management
│   │   ├── permissions/   # Permissions management
│   │   ├── projects/      # Example resource
│   │   ├── common/        # Shared guards & decorators
│   │   ├── prisma/        # Prisma service
│   │   └── redis/         # Redis service
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── docker-compose.yml
│
└── client/                 # Frontend (Next.js)
    ├── app/               # Next.js app directory
    │   ├── page.tsx       # Landing page
    │   ├── login/         # Login page
    │   ├── register/       # Register page
    │   └── app/           # Protected routes
    │       ├── page.tsx    # Dashboard
    │       ├── settings/   # Settings page
    │       └── invitations/# Invitations page
    ├── components/        # React components
    ├── contexts/          # React contexts
    └── lib/               # Utilities & API client
```

---

## 🔑 Authentication Flow

### 1. Registration
```
User → Register → Create User + Tenant + OWNER Role → Auto Login
```

### 2. Login
```
User → Login → Get Tenant List → Select Tenant → Get JWT Tokens
```

### 3. Protected Routes
```
Request → JWT Auth Guard → Tenant Guard → Permission Guard → Controller
```

### 4. User Invitation
```
Owner → Invite User → User Receives Invitation → Accept/Decline
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user & tenant | No |
| POST | `/auth/login` | Login and get tenant list | No |
| POST | `/auth/select-tenant` | Select tenant and get tokens | No* |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout and revoke tokens | Yes |
| GET | `/auth/me` | Get current user info | Yes |
| POST | `/auth/invite-user` | Invite user to tenant | Yes |
| GET | `/auth/tenant-users` | List tenant users | Yes |
| GET | `/auth/invitations` | Get user invitations | Yes |
| POST | `/auth/accept-invitation` | Accept invitation | Yes |
| POST | `/auth/decline-invitation` | Decline invitation | Yes |

*Requires `x-user-id` header

### Example Request

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Select Tenant
curl -X POST http://localhost:3001/auth/select-tenant \
  -H "Content-Type: application/json" \
  -H "x-user-id: user_id" \
  -d '{
    "tenantId": "tenant_id"
  }'

# Get Current User
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔐 Environment Variables

### Backend (`api/.env`)

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_api?schema=public"

# JWT
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

# Redis
REDIS_URL="redis://localhost:6379"

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🧪 Development

### Backend Commands

```bash
cd api

# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Database
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create migration
npx prisma generate        # Generate Prisma Client
```

### Frontend Commands

```bash
cd client

# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint
```

---

## 🧩 Architecture

### Multi-Tenant Data Model

```
User (1) ──< (N) TenantUser (N) >── (1) Tenant
                                    │
                                    ├── (N) Role
                                    │     └── (N) Permission
                                    │
                                    └── (N) Project
```

### JWT Token Structure

```json
{
  "sub": "user_id",
  "tenantId": "tenant_id",
  "roles": ["OWNER"],
  "permissions": ["user.invite", "role.create"],
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Guard Pipeline

```
Request
  ↓
JwtAuthGuard (Verify token)
  ↓
TenantGuard (Extract tenant)
  ↓
PermissionGuard (Check permissions)
  ↓
Controller
```

---

## 🎯 Usage Examples

### Creating a Protected Endpoint

```typescript
@Controller('projects')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
export class ProjectsController {
  @Post()
  @RequirePermission('project.create')
  create(@Req() req: any, @Body() dto: CreateProjectDto) {
    // req.tenantId is automatically set by TenantGuard
    return this.projectsService.create(req.tenantId, dto);
  }
}
```

### Inviting a User

```typescript
// Frontend
await authApi.inviteUser({
  email: 'newuser@example.com',
  roleId: 'role_id' // optional
});
```

### Checking Permissions

```typescript
// PermissionGuard automatically checks
// OWNER role bypasses all permission checks
@RequirePermission('user.invite')
```

---

## 🐳 Docker

### Start Services

```bash
cd api
docker compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### Stop Services

```bash
docker compose down
```

---

## 📝 Database Schema

Key models:
- **User** - Application users
- **Tenant** - Companies/organizations
- **TenantUser** - User-tenant membership
- **Role** - Tenant-scoped roles
- **Permission** - Global permissions
- **RolePermission** - Role-permission mapping
- **TenantUserRole** - User-role assignment

See `api/prisma/schema.prisma` for full schema.

---

## 🧪 Testing

```bash
# Backend tests
cd api
npm run test

# E2E tests
npm run test:e2e
```

---

## 🚧 Roadmap

- [ ] Email notifications for invitations
- [ ] Password reset flow
- [ ] Two-factor authentication (2FA)
- [ ] API rate limiting
- [ ] Audit logs
- [ ] Feature flags
- [ ] Billing integration
- [ ] Webhooks
- [ ] GraphQL API
- [ ] Real-time notifications (WebSocket)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ for developers who want to build great SaaS products**

</div>
