# 🛒 Ecommerce Microservice Platform

A production-grade, scalable e-commerce platform inspired by Flipkart, built with microservices architecture to handle high-volume transactions, real-time inventory management, and seamless user experiences. This platform supports multiple user roles, secure payments, and event-driven communication for reliability and performance.

## 📋 Table of Contents
- [System Architecture Overview](#system-architecture-overview)
- [Tech Stack](#tech-stack)
- [Microservices List](#microservices-list)
- [Features](#features)
- [User Roles](#user-roles)
- [Folder Structure](#folder-structure)
- [Architecture Diagram](#architecture-diagram)
- [Database Design Summary](#database-design-summary)
- [Event Driven Flow (SNS/SQS)](#event-driven-flow-snssqs)
- [Authentication & RBAC](#authentication--rbac)
- [Frontend Dashboards](#frontend-dashboards)
- [CI/CD Pipeline](#cicd-pipeline)
- [AWS Deployment](#aws-deployment)
- [Environment Setup](#environment-setup)
- [Local Setup using Docker](#local-setup-using-docker)
- [API Gateway Setup](#api-gateway-setup)
- [Running Tests](#running-tests)
- [Playwright Screenshot Automation](#playwright-screenshot-automation)
- [Security & Performance](#security--performance)
- [Future Enhancements](#future-enhancements)

## 🏗️ System Architecture Overview

This platform employs a microservices architecture to ensure scalability, fault isolation, and independent deployments. Services communicate via REST APIs and event-driven messaging using AWS SNS/SQS. The frontend is a React-based SPA, while backend services handle business logic, data persistence, and integrations. Infrastructure is containerized with Docker and deployed on AWS ECS Fargate for serverless scalability.

Key components:
- **Frontend**: Single-page application for user interactions.
- **Microservices**: Independent services for auth, products, cart, orders, etc.
- **Databases**: MongoDB for flexible data, PostgreSQL for transactional data.
- **Cache & Messaging**: Redis for caching, SNS/SQS for events.
- **Infra**: Docker for containerization, AWS for cloud deployment.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript, Vite for build tooling
- **Backend**: Node.js + Express (Microservices)
- **Databases**: MongoDB (NoSQL for products/catalog), PostgreSQL (SQL for orders/transactions)
- **Cache**: Redis
- **Messaging**: AWS SNS + SQS
- **Auth**: JWT + RBAC
- **Payment**: Stripe
- **Infra**: Docker + AWS ECS Fargate
- **CI/CD**: GitHub Actions
- **API Gateway**: AWS API Gateway for routing
- **Testing**: Playwright for automation screenshots

## 🔧 Microservices List

The platform consists of the following microservices, each handling specific business domains:

- **Auth Service**: User authentication, registration, and token management.
- **Product Service**: Product catalog, search, and inventory management.
- **Cart Service**: Shopping cart operations and persistence.
- **Order Service**: Order processing, fulfillment, and tracking.
- **Inventory Service**: Real-time stock updates and synchronization.
- **Payment Service**: Integration with Stripe for secure payments.
- **Notification Service**: Email/SMS notifications via SNS.

Each service is containerized and can be scaled independently.

## ✨ Features

- **User Management**: Registration, login, profile management with role-based access.
- **Product Catalog**: Advanced search, filtering, and recommendations.
- **Shopping Cart**: Persistent cart across sessions.
- **Order Management**: Seamless checkout, order history, and status tracking.
- **Payment Integration**: Secure Stripe payments with webhooks.
- **Inventory Sync**: Real-time updates via event-driven architecture.
- **Notifications**: Automated alerts for orders and updates.
- **Admin Dashboard**: Comprehensive management tools.
- **Seller Portal**: Product listing and sales analytics.
- **Responsive UI**: Mobile-first design for all devices.

## 👥 User Roles

- **Customer**: Browse products, add to cart, place orders, track shipments.
- **Seller**: List products, manage inventory, view sales reports.
- **Admin**: Oversee platform operations, manage users, monitor performance.

## 📁 Folder Structure

```
ecommercedemo/
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   ├── public/
│   └── package.json
├── services/                 # Microservices directory
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── inventory/
│   ├── payment/
│   └── notification/
├── scripts/                  # Utility scripts (seeding, integration)
├── tests/                    # Integration tests
├── docker-compose.dev.yml    # Local development setup
├── .github/workflows/        # CI/CD pipelines
├── package.json              # Root workspace config
└── README.md
```

## 📊 Architecture Diagram

```
[Frontend (React)] <--> [API Gateway] <--> [Microservices (Auth, Product, etc.)]
                                      |
                                      v
[Databases: MongoDB, PostgreSQL] <--> [Redis Cache]
                                      |
                                      v
[AWS SNS/SQS] <--> [Event Consumers]
```

*Placeholder: Insert architecture diagram here (e.g., Mermaid or image link).*

## 🗄️ Database Design Summary

- **MongoDB**: Used for product catalogs, user profiles, and flexible schemas (e.g., product attributes, reviews).
- **PostgreSQL**: Handles transactional data like orders, payments, and inventory levels with ACID compliance.
- **Redis**: Caches session data, frequently accessed products, and temporary states.

Tables/Collections include: Users, Products, Orders, Payments, Inventory, Carts.

## 📡 Event Driven Flow (SNS/SQS)

Events drive asynchronous communication:
- **Order Placed**: SNS topic publishes to SQS queues for inventory update, payment processing, and notifications.
- **Inventory Updated**: Triggers product availability checks.
- **Payment Confirmed**: Updates order status and sends confirmation emails.

This ensures loose coupling and scalability.

## 🔐 Authentication & RBAC

- **JWT Tokens**: Issued upon login, validated on each request.
- **RBAC**: Roles (Customer, Seller, Admin) with permissions (e.g., Admin can manage all, Seller can edit products).
- **Secure Endpoints**: Middleware enforces auth and role checks.

## 🎛️ Frontend Dashboards

- **Customer Dashboard**: Order history, profile settings, wishlist.
- **Seller Dashboard**: Product management, sales analytics, inventory tools.
- **Admin Dashboard**: User management, system metrics, configuration.

Built with React components for modularity.

## 🚀 CI/CD Pipeline

GitHub Actions automate:
- **Build**: Install dependencies, run tests.
- **Test**: Unit and integration tests with coverage.
- **Deploy**: Push to AWS ECS on main branch merges.

Workflows: `ci.yml` for builds, `integration.yml` for end-to-end tests.

## ☁️ AWS Deployment

- **ECS Fargate**: Serverless containers for microservices.
- **API Gateway**: Routes requests to services.
- **RDS**: Managed PostgreSQL and MongoDB (via DocumentDB).
- **ElastiCache**: Redis for caching.
- **S3**: Static asset storage.

Deployment via GitHub Actions with Terraform for infra.

## ⚙️ Environment Setup

Prerequisites:
- Node.js >= 18
- Docker & Docker Compose
- AWS CLI (for deployment)
- Git

## 🐳 Local Setup using Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/ecommercedemo.git
   cd ecommercedemo
   ```

2. Start services:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

3. Seed databases:
   ```bash
   ./scripts/seed_local.sh
   ```

4. Run frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Access at `http://localhost:3000`.

## 🌐 API Gateway Setup

1. Configure AWS API Gateway to proxy requests to ECS services.
2. Set up custom domains and SSL certificates.
3. Enable CORS and rate limiting.

## 🧪 Running Tests

- Unit tests: `npm test` in each service.
- Integration tests: `./scripts/run_integration.sh`
- All workspaces: `npm run test:workspaces`

## 📸 Playwright Screenshot Automation

Playwright captures screenshots during tests for visual regression:
- Run: `npx playwright test`
- Screenshots saved in `tests/screenshots/`

## 🔒 Security & Performance

- **Security**: JWT validation, input sanitization, HTTPS enforcement.
- **Performance**: Redis caching, database indexing, horizontal scaling on ECS.
- **Monitoring**: AWS CloudWatch for logs and metrics.

## 🚀 Future Enhancements

- AI-powered recommendations.
- Multi-region deployment.
- Advanced analytics with data lakes.
- Mobile app integration.
- Blockchain for supply chain transparency.

---

*This README is maintained by the development team. For contributions, see CONTRIBUTING.md.*