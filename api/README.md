# 🚀 Multi-Tenant SaaS Starter Kit (NestJS + Prisma)

Production-ready, **multi-tenant SaaS backend starter kit** built with **NestJS**, **Prisma**, **PostgreSQL**, and **Redis**.

This project provides a solid foundation for building **enterprise-grade SaaS applications** with:
- Multi-tenant architecture
- Role & permission-based authorization
- JWT authentication (access + refresh)
- Tenant isolation
- Scalable and clean code structure

---

## ✨ Features

### 🔐 Authentication & Security
- JWT Access Token
- Refresh Token (stored & revoked via Redis)
- Logout & token revocation
- Secure password hashing (bcrypt)
- Guard-based security pipeline

### 🏢 Multi-Tenant Architecture
- Multiple tenants (companies)
- Users can belong to **multiple tenants**
- Tenant-scoped data access
- Strict tenant isolation

### 🎭 Roles & Permissions
- Tenant-based roles (OWNER, ADMIN, custom roles)
- Global permissions (e.g. `project.create`)
- Role → Permission mapping
- User → Role assignment
- Declarative permission checks via decorators

### 🧱 Authorization Guards
- `JwtAuthGuard`
- `TenantGuard`
- `PermissionGuard`

### 📦 Example Resource
- Tenant-scoped `Project` entity
- Fully protected with role & permission checks

### ⚡ Infrastructure
- PostgreSQL (Docker)
- Redis (Docker)
- Prisma ORM
- Clean modular NestJS structure

---

## 🧠 Architecture Overview

```text
User
 ├─ belongs to many Tenants
Tenant
 ├─ has Users (TenantUser)
 ├─ has Roles
Role
 ├─ has Permissions
TenantUser
 ├─ has Roles
```

JWT payload example:

```json
{
  "sub": "user_id",
  "tenantId": "tenant_id",
  "roles": ["OWNER"],
  "permissions": ["project.create", "project.read"]
}
```

---

## 🛠️ Tech Stack

* **Node.js**
* **NestJS**
* **Prisma**
* **PostgreSQL**
* **Redis**
* **Docker / Docker Compose**
* **Passport.js**
* **JWT**

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/ismailcankaratas/saas-multi-tenant-starter.git
cd saas-multi-tenant-starter/api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create `.env` file in the `api` directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_api?schema=public"

JWT_ACCESS_SECRET="access-secret"
JWT_REFRESH_SECRET="refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="30d"

REDIS_URL="redis://localhost:6379"
```

---

### 4️⃣ Start Infrastructure (Postgres + Redis)

```bash
docker compose up -d
```

---

### 5️⃣ Database Migration

```bash
npx prisma generate
npx prisma migrate dev
```

---

### 6️⃣ Start API

```bash
npm run start:dev
```

---

## 🔑 Authentication Flow

1. **Register**

   * Creates user
   * Creates tenant
   * Assigns OWNER role

2. **Login**

   * Returns tenant list

3. **Select Tenant**

   * Returns JWT access + refresh token

4. **Authorized Requests**

   * JWT → Guards → Controller

---

## 🔐 Example Protected Endpoint

```ts
@Post()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
@RequirePermission('project.create')
createProject() {}
```

---

## 🧪 Example SQL (Docker CLI)

```bash
docker exec -it saas_postgres psql -U postgres -d saas_api
```

```sql
INSERT INTO "Permission" (id, key, description)
VALUES (gen_random_uuid(), 'project.create', 'Create project');
```

---

## 📁 Project Structure

```text
src/
 ├─ auth/
 ├─ roles/
 ├─ permissions/
 ├─ projects/
 ├─ common/
 │   ├─ guards/
 │   ├─ decorators/
 ├─ prisma/
 └─ redis/
```

---

## 🧩 Roadmap

* [ ] Invite employee flow
* [ ] Token versioning
* [ ] Feature flags & plans
* [ ] Audit logs
* [ ] API rate limiting
* [ ] SaaS billing integration

---

## 🤝 Contributing

Pull requests are welcome.

If you plan major changes:

* Open an issue first
* Discuss what you'd like to change

---

## 📄 License

MIT License © 2026

---

## ⭐ Why This Project?

This starter kit is designed for developers who want to:

* Build **real-world SaaS systems**
* Avoid rewriting auth & multi-tenant logic
* Start with **clean architecture**
* Scale without refactoring hell

If this helps you, **give it a ⭐** 🙂
