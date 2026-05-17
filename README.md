# 🚗 Car Scrap Yard Management System

### Production-Inspired Microservices Platform using Spring Boot, Docker & JWT Security

<div align="center">

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Microservices-Architecture-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql" />
  <img src="https://img.shields.io/badge/JWT-Security-red?style=for-the-badge" />
</p>

</div>

---

# 📌 Overview

Car Scrap Yard Management System is a production-inspired distributed backend application built using a microservices architecture.

The platform simulates a real-world vehicle scrap management system where users can:

- Register and authenticate securely
- Search nearby scrap yards
- Estimate scrap prices
- Book appointments
- Cancel or reschedule bookings
- Track appointment workflows
- Receive automated email notifications

The system also supports operational management through multiple roles:

- Super Admin
- Admin
- Staff
- User

---

# 🌐 Live Deployment

The project is deployed on AWS EC2 for portfolio and backend engineering practice purposes.

## 🔗 Live Website

https://carscrapy.online

---

# ☁️ Deployment Environment

- AWS EC2 (Ubuntu Server)
- Docker Compose
- NGINX Reverse Proxy
- HTTPS Enabled
- Custom Domain Configuration
- Dockerized Spring Boot Microservices
- Dockerized MySQL Databases

---

# ⚠️ Availability Note

Since this is a self-hosted learning project running on a limited cloud budget,
availability may occasionally vary during maintenance or server shutdown periods.

---

# 📸 Deployment Evidence

## 🔐 Login Page

<div align="center">
  <img src="assets/login.png" alt="Login Page" width="100%" />
</div>

---

## 📊 Dashboard

<div align="center">
  <img src="assets/dashboard.png" alt="Dashboard" width="100%" />
</div>

---

## 💰 Scrap Price Estimation Workflow

<div align="center">
  <img src="assets/findingEstimateOfCar.png" alt="Price Estimation" width="70%" />
</div>

---

## 📅 Appointment Booking Workflow

<div align="center">
  <img src="assets/appointment-booking.png" alt="Appointment Booking" width="70%" />
</div>

---

## 📄 Appointment Management

<div align="center">
  <img src="assets/appointmnt-booking-info.png" alt="Appointment Details" width="70%" />
</div>

---

# ☁️ Production Deployment Architecture

```txt
Client Browser
       ↓
carscrapy.online
       ↓
NGINX (Ubuntu Host Machine)
       ↓
API Gateway (Docker Container)
       ↓
Eureka Service Discovery
       ↓
Spring Boot Microservices
       ↓
MySQL Databases (Docker Containers)
```

---

# 🧩 Core Services

| Service | Responsibility |
|---|---|
| Auth Service | Authentication & Authorization |
| Booking Service | Appointment workflows |
| Car Service | Vehicle validation & pricing |
| Yard Service | Yard & staff management |
| Email Service | Notifications & verification |
| API Gateway | Centralized routing & security |
| Eureka Server | Dynamic service discovery |

---

# 🔐 Security

The system uses:

- JWT Authentication
- Spring Security
- Role-Based Authorization
- Protected APIs
- Environment Variable Based Secret Management

---

# 🐳 Dockerized Infrastructure

## Containerized Services

- API Gateway
- Eureka Registry
- Spring Boot Microservices
- MySQL Databases

## Host-Level Services

- NGINX Reverse Proxy

---

# 🧰 Tech Stack

| Backend | DevOps | Database | Frontend |
|---|---|---|---|
| Java 17 | Docker | MySQL 8 | HTML |
| Spring Boot | Docker Compose | JPA/Hibernate | CSS |
| Spring Security | NGINX |  | JavaScript |
| Spring Cloud | AWS EC2 |  |  |
| Eureka | Ubuntu |  |  |
| OpenFeign | Maven |  |  |
| Resilience4j | GitHub |  |  |

---

# 🚀 Running the Project

## Clone Repository

```bash
git clone https://github.com/yaseenpatelsd/carscrap-microservices-system.git
```

## Start Docker Containers

```bash
docker-compose up --build
```

---

# 📈 Key Highlights

✅ Microservices Architecture  
✅ API Gateway Pattern  
✅ Eureka Service Discovery  
✅ JWT Authentication & Authorization  
✅ Dockerized Deployment  
✅ Dedicated Database Per Service  
✅ Async Event-Driven Communication  
✅ Retry Mechanism  
✅ Circuit Breaker & Fallback Handling  
✅ Role-Based Access Control  
✅ AWS EC2 Deployment  
✅ HTTPS Enabled Production Access  

---

# 👨‍💻 Author

## Yaseen Patel

Backend Developer | Java & Spring Boot Enthusiast

GitHub:
https://github.com/yaseenpatelsd

---

Built for learning, portfolio, and backend engineering practice.
