<div align="center">

# 🚗 Car Scrap Yard Management System

### Production-Oriented Microservices Backend using Spring Boot, Docker & JWT Security

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot" />
  <img src="https://img.shields.io/badge/Microservices-Architecture-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql" />
</p>

<p align="center">
  <a href="https://github.com/yaseenpatelsd/carscrap-microservices-system">
    <img src="https://img.shields.io/github/stars/yaseenpatelsd/carscrap-microservices-system?style=social" />
  </a>
</p>

</div>

---

## 📌 Overview

Car Scrap Yard Management System is a scalable and production-oriented **microservices backend application** built using:

- Java Spring Boot
- Spring Cloud
- Eureka Service Discovery
- API Gateway
- Docker & Docker Compose
- JWT Authentication
- MySQL
- NGINX

The system manages:
- Vehicle scrap appointments
- Yard operations
- Staff assignment workflows
- Authentication & authorization
- Automated email notifications
- Role-based access control

This project was designed to simulate a **real-world distributed backend system** using modern backend engineering practices.

---

# 🏗️ System Architecture

<div align="center">
  <img src="assets/architecture.png" alt="Microservices Architecture" width="100%" />
</div>

<div align="center">
  <i>Complete Microservices Architecture Overview</i>
</div>

---

## 🔄 Architecture Flow

```txt
Client → NGINX → API Gateway → Eureka Service Discovery → Microservices → Dedicated Databases
```

The system follows a distributed microservices architecture where all requests pass through the API Gateway.

### Core Architecture Components

| Component | Responsibility |
|---|---|
| API Gateway | Routing, JWT Validation, Load Balancing |
| Eureka Server | Dynamic Service Discovery |
| Auth Service | Authentication & Authorization |
| Car Service | Vehicle Validation & Pricing |
| Booking Service | Appointment Workflows |
| Yard Service | Yard & Staff Management |
| Email Service | Notifications & Verification |
| MySQL Databases | Dedicated Database Per Service |
| Docker | Containerized Deployment |

---

# 📊 Project Structure Diagram

<div align="center">
  <img src="assets/project-structure.png" alt="Project Structure" width="100%" />
</div>

<div align="center">
  <i>Microservices Project Structure & Technology Stack</i>
</div>

---

# 👥 Use Case Diagram

<div align="center">
  <img src="assets/usecase-diagram.png" alt="Use Case Diagram" width="100%" />
</div>

<div align="center">
  <i>System Use Cases & Role Interactions</i>
</div>

---

# 🔁 Sequence Diagrams

## 📅 User Booking Appointment Workflow

<div align="center">
  <img src="assets/booking-sequence.png" alt="Booking Sequence Diagram" width="100%" />
</div>

<div align="center">
  <i>User Appointment Booking Flow Across Microservices</i>
</div>

---

## 👷 Staff Appointment Status Workflow

<div align="center">
  <img src="assets/staff-sequence.png" alt="Staff Sequence Diagram" width="100%" />
</div>

<div align="center">
  <i>Staff Appointment Status Update Workflow</i>
</div>

---

# ✨ Features

## 👤 User Features

- Register & Login
- Search yards by:
  - City
  - State
  - Pincode
  - Yard Name
- Vehicle eligibility check
- Scrap price estimation
- Book appointments
- Cancel appointments
- Reschedule appointments
- Track appointment status

---

## 🛡️ Super Admin Features

- Create yards
- Create admins
- Create staff
- Assign admins to yards
- Assign staff to yards
- Manage system operations

### Rules

- One yard can have:
  - One admin
  - Multiple staff members

---

## 🏢 Admin Features

- Open / Close yard
- Manage yard staff
- Assign staff to appointments
- Update yard details
- Approve appointments
- Mark appointments as missed
- Mark appointments as completed

---

## 👷 Staff Features

- Manage assigned appointments
- Update appointment status
- Open / Close assigned yard
- Complete assigned tasks

---

# 🔐 Security

The system uses:

- JWT Authentication
- Spring Security
- Role-Based Authorization
- Protected APIs
- Environment Variable Based Secret Management

Sensitive information such as:

- Database passwords
- JWT secrets
- Email credentials

are stored using `.env` files and excluded using `.gitignore`.

---

# ⚙️ Microservices

## 🔐 Auth Service

Handles:
- Registration
- Login
- JWT generation
- Password reset
- Role management

---

## 📅 Booking Service

Handles:
- Booking appointments
- Rescheduling
- Cancellation
- Appointment tracking
- Staff assignment
- Missed appointment handling

---

## 🏭 Yard Service

Handles:
- Yard management
- Staff management
- Yard availability
- Yard operations

---

## 🚘 Car Service

Handles:
- Vehicle validation
- Scrap eligibility checks
- Dynamic pricing
- Vehicle management

---

## 📧 Email Service

Handles:
- Verification emails
- Appointment notifications
- Reminder emails
- Password reset emails

---

# 🧰 Tech Stack

<div align="center">

| Backend | DevOps | Database | Frontend |
|---|---|---|---|
| Java 17 | Docker | MySQL 8 | HTML |
| Spring Boot | Docker Compose | JPA/Hibernate | CSS |
| Spring Security | NGINX | | JavaScript |
| Spring Cloud | GitHub | | |
| Eureka | Maven | | |
| OpenFeign | Postman | | |

</div>

---

# 🌐 Service Ports

| Service | Port |
|---|---|
| API Gateway | 8080 |
| Auth Service | 8081 |
| Email Service | 8082 |
| Car Service | 8083 |
| Booking Service | 8084 |
| Yard Service | 8085 |
| Eureka Server | 8761 |

---

# 📂 Project Structure

```txt
CarScrapProject/
│
├── AUTH-SERVICE/
├── Booking-Service/
├── car-service/
├── yard-service/
├── Email_Service/
├── gateway/
├── service-registry/
├── frontend/
├── nginx/
├── docker-compose.yml
└── README.md
```

---

# 🐳 Dockerized Deployment

The complete system is containerized using Docker Compose.

### Services Running in Containers

- API Gateway
- Eureka Registry
- MySQL
- NGINX
- All Spring Boot Microservices

---

# 🚀 Running the Project

## Clone Repository

```bash
git clone https://github.com/yaseenpatelsd/carscrap-microservices-system.git
```

---

## Start Docker Containers

```bash
docker-compose up --build
```

---

# 📸 Additional Diagrams

## Use Case Diagram

<div align="center">
  <img src="assets/usecase-diagram.png" width="100%" />
</div>

---

## Sequence Diagram

<div align="center">
  <img src="assets/sequence-diagram.png" width="100%" />
</div>

---

# 📈 Key Highlights

✅ Microservices Architecture  
✅ API Gateway Pattern  
✅ Eureka Service Discovery  
✅ JWT Authentication  
✅ Dockerized Deployment  
✅ Role-Based Access Control  
✅ Independent Databases  
✅ Appointment Automation Logic  
✅ Yard & Staff Management  
✅ Email Notification System  
✅ Production-Oriented Structure  

---

# 🚀 Future Improvements

- Kubernetes Deployment
- RabbitMQ / Kafka Integration
- Redis Caching
- CI/CD Pipeline
- Monitoring with Prometheus & Grafana
- Centralized Logging
- SMS Notifications
- Payment Integration

---

# 📚 Learning Outcomes

This project helped in understanding:

- Microservices Architecture
- Distributed Systems
- Docker Containerization
- Service Discovery
- API Gateway Pattern
- JWT Security
- Backend Scalability
- Real-world Backend Design
- Inter-service Communication

---

<div align="center">

## 👨‍💻 Author

### Yaseen Patel

Backend Developer | Java & Spring Boot Enthusiast

<a href="https://github.com/yaseenpatelsd">GitHub Profile</a>

</div>

---

<div align="center">

Made for learning, portfolio, and backend engineering practice.

</div>

