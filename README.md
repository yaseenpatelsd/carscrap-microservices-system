<h1 align="center">🚗 CarScrapy</h1>

<h3 align="center">Car Scrap Yard Management System</h3>

<p align="center">
  A full-stack car scrap management platform built with Spring Boot Microservices, React, Docker and AWS.
</p>

<p align="center">
  <a href="https://carscrapy.online">🌐 Live Website</a> •
  <a href="https://github.com/yaseenpatelsd/carscrap-microservices-system">📂 GitHub Repository</a>
</p>

---

<h2>📌 About The Project</h2>

<p>
  CarScrapy is a full-stack application I built to manage the process of scrapping vehicles and connecting customers with scrap yards.
</p>

<p>
  The main focus of this project is the backend. Instead of building everything as one Spring Boot application, I split the backend into multiple microservices, where each service handles a specific part of the system.
</p>

<p>
  The backend is built with Java and Spring Boot and uses Spring Cloud components such as Eureka, API Gateway and OpenFeign for service discovery and communication between services.
</p>

<p>
  The complete application is containerized using Docker and is currently deployed on an AWS EC2 Ubuntu server. NGINX sits in front of the application and handles HTTPS traffic before forwarding requests to the API Gateway.
</p>

<p>
  The frontend is a React + TypeScript application built with Vite.
</p>

---

<h2>🌐 Live Application</h2>

<p>
  The project is currently deployed and available online:
</p>

<p>
  <a href="https://carscrapy.online">
    <strong>👉 https://carscrapy.online</strong>
  </a>
</p>

<p>
  The live deployment runs the Dockerized backend on an AWS EC2 instance with NGINX handling the public HTTPS traffic.
</p>

---

<h2>🏗️ Architecture</h2>

<p>
  The backend follows a microservices architecture. Each service has its own responsibility instead of putting all the business logic into one application.
</p>

<pre>
                         ┌───────────────────┐
                         │      Browser      │
                         │   React Frontend  │
                         └─────────┬─────────┘
                                   │
                                   │ HTTPS
                                   ▼
                         ┌───────────────────┐
                         │       NGINX       │
                         │   Reverse Proxy   │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   API Gateway     │
                         │  Spring Cloud GW  │
                         └─────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │    Auth     │      │     Car     │      │    Yard     │
       │   Service   │      │   Service   │      │   Service   │
       └─────────────┘      └─────────────┘      └─────────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   │
                         ┌─────────▼─────────┐
                         │ Booking Service   │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼─────────┐
                         │  Email Service    │
                         └───────────────────┘

                         ┌───────────────────┐
                         │   Eureka Server   │
                         │ Service Discovery │
                         └───────────────────┘
</pre>

---

<h2>🧩 Backend Services</h2>

<table>
  <tr>
    <th>Service</th>
    <th>What it does</th>
  </tr>
  <tr>
    <td><strong>API Gateway</strong></td>
    <td>Single entry point for requests coming from the frontend. Handles routing and gateway-level security.</td>
  </tr>
  <tr>
    <td><strong>Eureka Server</strong></td>
    <td>Keeps track of the running services and allows them to find each other without hardcoded addresses.</td>
  </tr>
  <tr>
    <td><strong>Auth Service</strong></td>
    <td>Handles registration, login, OTP verification, JWT generation and user roles.</td>
  </tr>
  <tr>
    <td><strong>Car Service</strong></td>
    <td>Handles vehicle information and scrap price estimation.</td>
  </tr>
  <tr>
    <td><strong>Yard Service</strong></td>
    <td>Handles scrap yard information and yard searching.</td>
  </tr>
  <tr>
    <td><strong>Booking Service</strong></td>
    <td>Handles appointments, booking, rescheduling and cancellations.</td>
  </tr>
  <tr>
    <td><strong>Email Service</strong></td>
    <td>Handles email verification and application notifications.</td>
  </tr>
</table>

---

<h2>🔐 Authentication & Security</h2>

<p>
  Authentication is handled using Spring Security and JWT. The application does not rely on traditional server-side sessions.
</p>

<p>
  After logging in, the user receives a JWT which is then sent with protected API requests.
</p>

<pre>
User
 │
 │ Login
 ▼
Auth Service
 │
 │ Validate credentials
 ▼
JWT Token
 │
 │ Authorization: Bearer Token
 ▼
API Gateway
 │
 ▼
Requested Microservice
</pre>

<h3>Security features</h3>

<ul>
  <li>JWT based authentication</li>
  <li>Spring Security</li>
  <li>BCrypt password hashing</li>
  <li>Role-Based Access Control</li>
  <li>OTP based account verification</li>
  <li>Protected REST APIs</li>
  <li>Stateless authentication</li>
</ul>

---

<h2>👥 User Roles</h2>

<p>
  Different parts of the application are available depending on the user's role.
</p>

<table>
  <tr>
    <th>Role</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td><code>SUPER_ADMIN</code></td>
    <td>System-wide administration</td>
  </tr>
  <tr>
    <td><code>ADMIN</code></td>
    <td>Manages yard and operational activities</td>
  </tr>
  <tr>
    <td><code>STAFF</code></td>
    <td>Handles appointments and vehicle-related operations</td>
  </tr>
  <tr>
    <td><code>USER</code></td>
    <td>Customer using the platform</td>
  </tr>
  <tr>
    <td><code>GUEST</code></td>
    <td>Temporary access for users who don't want to create an account</td>
  </tr>
</table>

---

<h2>🔄 Service Communication</h2>

<p>
  Since the application is made up of multiple services, the services need a way to find and communicate with each other.
</p>

<p>
  Eureka handles service discovery, while OpenFeign is used for communication between services.
</p>

<pre>
Booking Service
      │
      │ "Where is Auth Service?"
      ▼
Eureka Server
      │
      │ Service location
      ▼
Auth Service
</pre>

<p>
  This means the services don't have to depend on fixed IP addresses or manually configured service locations.
</p>

---

<h2>🛡️ Resilience</h2>

<p>
  The backend also uses Resilience4j for handling failures between services.
</p>

<p>
  This is useful in a microservices setup because one service can go down while the rest of the application is still running. Instead of letting a failed request bring down the whole chain, the application can use retry and circuit breaker mechanisms where required.
</p>

<ul>
  <li>Retry</li>
  <li>Circuit Breaker</li>
  <li>Failure handling</li>
  <li>Graceful fallback behaviour</li>
</ul>

---

<h2>🗄️ Database</h2>

<p>
  The backend uses MySQL with Spring Data JPA and Hibernate for persistence.
</p>

<p>
  The project follows the database-per-service approach, where services are responsible for their own data instead of having every service directly access one shared database.
</p>

<pre>
Auth Service       → Auth Database
Car Service        → Car Database
Yard Service       → Yard Database
Booking Service    → Booking Database
</pre>

---

<h2>🚘 Main Features</h2>

<ul>
  <li>User registration and login</li>
  <li>OTP based account verification</li>
  <li>JWT authentication</li>
  <li>Role-based access control</li>
  <li>Vehicle scrap price estimation</li>
  <li>Scrap yard search</li>
  <li>Appointment booking</li>
  <li>Appointment rescheduling and cancellation</li>
  <li>User appointment management</li>
  <li>Admin management features</li>
  <li>Staff operations</li>
  <li>Guest access</li>
  <li>Email notifications</li>
</ul>

---

<h2>📡 API Flow</h2>

<p>
  The frontend does not directly call individual microservices. Requests go through the API Gateway first.
</p>

<pre>
React Frontend
      │
      ▼
NGINX
      │
      ▼
API Gateway
      │
      ├── Auth Service
      ├── Car Service
      ├── Yard Service
      ├── Booking Service
      └── Email Service
</pre>

<p>
  This gives the application one public API entry point while keeping the individual services behind the gateway.
</p>

---

<h2>🐳 Docker</h2>

<p>
  Each backend service runs inside its own Docker container. Docker Compose is used to start and manage the complete backend environment.
</p>

<pre>
Docker Host
│
├── API Gateway
├── Eureka Server
├── Auth Service
├── Car Service
├── Yard Service
├── Booking Service
├── Email Service
└── MySQL
</pre>

<h3>Start the application</h3>

<pre>
docker compose up --build
</pre>

<h3>Run in background</h3>

<pre>
docker compose up -d --build
</pre>

<h3>Stop the application</h3>

<pre>
docker compose down
</pre>

<h3>Check running containers</h3>

<pre>
docker ps
</pre>

<h3>View logs</h3>

<pre>
docker compose logs -f
</pre>

---

<h2>☁️ AWS Deployment</h2>

<p>
  The application is currently deployed on an AWS EC2 Ubuntu server.
</p>

<p>
  The deployment uses Docker to run the backend services and NGINX as the reverse proxy.
</p>

<pre>
GitHub
   │
   ▼
AWS EC2
   │
   ▼
Docker Compose
   │
   ├── Microservices
   ├── Eureka
   ├── API Gateway
   └── MySQL
   │
   ▼
NGINX
   │
   ▼
HTTPS
   │
   ▼
carscrapy.online
</pre>

<p>
  This is also the environment where the live version of CarScrapy is running.
</p>

---

<h2>🌐 NGINX & HTTPS</h2>

<p>
  NGINX sits in front of the application and handles incoming HTTPS traffic.
</p>

<pre>
Browser
   │
   │ HTTPS
   ▼
NGINX
   │
   │ Forward request
   ▼
API Gateway
   │
   ▼
Microservices
</pre>

<p>
  This keeps the internal services away from direct public access and gives the application a single public endpoint.
</p>

---

<h2>🖥️ Frontend</h2>

<p>
  The frontend is a React Single Page Application built using TypeScript and Vite.
</p>

<p>
  It communicates with the backend through the API Gateway and provides different dashboards and features based on the user's role.
</p>

<h3>Frontend stack</h3>

<ul>
  <li>React</li>
  <li>TypeScript</li>
  <li>Vite</li>
  <li>Tailwind CSS</li>
</ul>

<h3>Frontend features</h3>

<ul>
  <li>Login and registration</li>
  <li>JWT session handling</li>
  <li>Customer dashboard</li>
  <li>Admin dashboard</li>
  <li>Staff dashboard</li>
  <li>Super Admin dashboard</li>
  <li>Guest mode</li>
  <li>Scrap price estimation</li>
  <li>Scrap yard search</li>
  <li>Appointment booking</li>
  <li>Appointment management</li>
</ul>

---

<h2>🛠️ Tech Stack</h2>

<h3>Backend</h3>

<table>
  <tr>
    <th>Technology</th>
    <th>Used For</th>
  </tr>
  <tr>
    <td>Java 21</td>
    <td>Backend development</td>
  </tr>
  <tr>
    <td>Spring Boot</td>
    <td>Microservices</td>
  </tr>
  <tr>
    <td>Spring Security</td>
    <td>Authentication and authorization</td>
  </tr>
  <tr>
    <td>JWT</td>
    <td>Stateless authentication</td>
  </tr>
  <tr>
    <td>Spring Cloud Gateway</td>
    <td>API Gateway</td>
  </tr>
  <tr>
    <td>Netflix Eureka</td>
    <td>Service discovery</td>
  </tr>
  <tr>
    <td>OpenFeign</td>
    <td>Service-to-service communication</td>
  </tr>
  <tr>
    <td>Resilience4j</td>
    <td>Fault tolerance</td>
  </tr>
  <tr>
    <td>Spring Data JPA</td>
    <td>Database access</td>
  </tr>
  <tr>
    <td>Hibernate</td>
    <td>ORM</td>
  </tr>
  <tr>
    <td>MySQL</td>
    <td>Database</td>
  </tr>
  <tr>
    <td>Maven</td>
    <td>Build and dependency management</td>
  </tr>
  <tr>
    <td>MapStruct</td>
    <td>DTO mapping</td>
  </tr>
  <tr>
    <td>Lombok</td>
    <td>Reducing boilerplate</td>
  </tr>
  <tr>
    <td>SpringDoc OpenAPI</td>
    <td>API documentation</td>
  </tr>
</table>

<h3>Frontend</h3>

<ul>
  <li>React</li>
  <li>TypeScript</li>
  <li>Vite</li>
  <li>Tailwind CSS</li>
</ul>

<h3>DevOps</h3>

<ul>
  <li>Docker</li>
  <li>Docker Compose</li>
  <li>AWS EC2</li>
  <li>Ubuntu</li>
  <li>NGINX</li>
  <li>Git</li>
  <li>GitHub</li>
</ul>

---

<h2>📁 Project Structure</h2>

<pre>
carscrap-microservices-system/
│
├── Backend/
│   │
│   ├── api-gateway/
│   ├── eureka-server/
│   ├── auth-service/
│   ├── car-service/
│   ├── yard-service/
│   ├── booking-service/
│   └── email-service/
│
├── Frontend/
│   │
│   └── React + TypeScript + Vite
│
├── docker-compose.yml
├── .env.example
└── README.md
</pre>

---

<h2>🚀 Running Locally</h2>

<h3>Requirements</h3>

<ul>
  <li>Java 21</li>
  <li>Maven</li>
  <li>Docker</li>
  <li>Docker Compose</li>
  <li>Node.js</li>
  <li>npm</li>
  <li>Git</li>
</ul>

<h3>1. Clone the repository</h3>

<pre>
git clone https://github.com/yaseenpatelsd/carscrap-microservices-system.git

cd carscrap-microservices-system
</pre>

<h3>2. Configure environment variables</h3>

<p>
  Create your environment file and add the required database, email and security configuration.
</p>

<pre>
cp .env.example .env
</pre>

<p>
  Make sure you don't commit production credentials or secrets to GitHub.
</p>

<h3>3. Start the backend</h3>

<pre>
docker compose up --build
</pre>

<h3>4. Start the frontend</h3>

<pre>
cd Frontend

npm install

npm run dev
</pre>

---

<h2>🔌 Default Service Ports</h2>

<table>
  <tr>
    <th>Service</th>
    <th>Port</th>
  </tr>
  <tr>
    <td>API Gateway</td>
    <td><code>8080</code></td>
  </tr>
  <tr>
    <td>Eureka Server</td>
    <td><code>8761</code></td>
  </tr>
  <tr>
    <td>Auth Service</td>
    <td><code>8081</code></td>
  </tr>
  <tr>
    <td>Booking Service</td>
    <td><code>8082</code></td>
  </tr>
  <tr>
    <td>Car Service</td>
    <td><code>8083</code></td>
  </tr>
  <tr>
    <td>Yard Service</td>
    <td><code>8084</code></td>
  </tr>
  <tr>
    <td>Email Service</td>
    <td><code>8085</code></td>
  </tr>
</table>

---

<h2>📊 Project Stats</h2>

<table>
  <tr>
    <td><strong>Backend Services</strong></td>
    <td>7</td>
  </tr>
  <tr>
    <td><strong>REST APIs</strong></td>
    <td>75+</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>JWT + Spring Security</td>
  </tr>
  <tr>
    <td><strong>Service Discovery</strong></td>
    <td>Eureka</td>
  </tr>
  <tr>
    <td><strong>API Gateway</strong></td>
    <td>Spring Cloud Gateway</td>
  </tr>
  <tr>
    <td><strong>Inter-service Communication</strong></td>
    <td>OpenFeign</td>
  </tr>
  <tr>
    <td><strong>Fault Tolerance</strong></td>
    <td>Resilience4j</td>
  </tr>
  <tr>
    <td><strong>Deployment</strong></td>
    <td>AWS EC2 + Docker</td>
  </tr>
  <tr>
    <td><strong>Reverse Proxy</strong></td>
    <td>NGINX</td>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React + TypeScript</td>
  </tr>
</table>

---

<h2>🧪 Development & Testing</h2>

<p>
  I used IntelliJ IDEA and Maven for backend development and Postman for testing the REST APIs.
</p>

<p>
  The services can be tested individually during development, while requests from the frontend follow the same Gateway → Service flow used in the deployed application.
</p>

---

<h2>📚 What I Built This Project To Learn</h2>

<p>
  This project started as a way to build something beyond a basic CRUD application and understand how a real backend can be split into multiple independent services.
</p>

<p>
  While building it, I worked with service discovery, API gateways, JWT authentication, inter-service communication, Docker networking, database management, fault tolerance and cloud deployment.
</p>

<p>
  Deploying the application on an actual EC2 server also gave me experience with Linux, Docker containers, NGINX, HTTPS and running a backend outside my local development environment.
</p>

---

<h2>👨‍💻 Author</h2>

<h3>Yaseen Patel</h3>

<p>
  BCA Graduate • Java Backend Developer
</p>

<p>
  <a href="https://github.com/yaseenpatelsd">GitHub</a> •
  <a href="https://www.linkedin.com/in/yaseen-patel-65099b3a8">LinkedIn</a> •
  <a href="https://carscrapy.online">Live Project</a>
</p>

---

<h2>📄 License</h2>

<p>
  This project was created as a personal portfolio and learning project.
</p>

<p>
  Feel free to explore the code and architecture, but please don't present the project or its source code as your own.
</p>

<p align="center">
  <strong>🚗 Built with Java, Spring Boot, Docker and a lot of debugging.</strong>
</p>
