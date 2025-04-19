# Product API

A server-side application built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/), integrated with Contentful CMS and PostgreSQL.

## Table of Contents

- [Description](#description)
- [Project Setup](#project-setup)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Running the Application with Docker](#running-the-application-with-docker)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Migrations](#migrations)
- [Testing](#testing)
- [CI/CD](#cicd)

---

## Description

This project provides a RESTful API for managing products, including:

- Data synchronization with Contentful CMS.
- Logical deletion of products.
- Public and private endpoints (JWT-based authentication).
- Pagination and filtering.
- Report generation.

---

## Project Setup

```bash
npm install
```

To start the server locally:

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod
```

---

## Database

We are using **PostgreSQL** as the database engine.

### Manual Setup (Optional for Local Testing)

```bash
# Create a custom Docker network
docker network create app-network

# Run PostgreSQL container
docker run --name postgres-container --network app-network \
  -e POSTGRES_USER=jgonzalezc \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=product_api \
  -p 5432:5432 \
  -d postgres:latest
```

---

## Environment Variables

Create a `.env` file at the root of the project:

```env
DB_HOST=postgres-container
DB_PORT=5432
DB_USERNAME=jgonzalezc
DB_PASSWORD=password
DB_DATABASE=product_api
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
JWT_SECRET=your_jwt_secret
```

---

## Running the Application with Docker

You can run the full stack (server + database) using Docker Compose.

```bash
docker compose up --build
```

To stop and remove containers:

```bash
docker compose down
```

---

## API Documentation

Swagger UI is available at:

```bash
http://localhost:3000/api/docs
```

---

## Authentication

Private endpoints require a valid JWT token.

To generate a token:

```bash
POST /auth/login
{
  "username": "admin",
  "password": "password"
}
```

Use the received token as:

```http
Authorization: Bearer <token>
```

---

## Migrations

### Create a New Migration

```bash
npx typeorm migration:create src/migrations/CreateProductsTable
```

### Run Migrations

```bash
docker exec -it <container_id> npm run migration:run
```

---

## Testing

Run tests locally:

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Coverage report
npm run test:cov
```

---

## CI/CD

CI/CD pipelines (using GitHub Actions) include:

- Linting (ESLint)
- Unit and e2e testing (Jest)
- Docker build validation (optional)

Workflows are defined inside `.github/workflows/`.

---

## Useful Docker Commands

```bash
# List running containers
docker ps

# View container logs
docker logs <container_id>

# Stop a container
docker stop <container_name>

# Remove a container
docker rm <container_name>

# List images
docker images
```

---

## Notes

- Ensure that Contentful credentials are correct and the synchronization task is running as scheduled.
- Docker volumes are used to persist PostgreSQL data.
