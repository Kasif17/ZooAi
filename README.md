# 🦓 ZooAi

### AI-Powered Code Editor & Developer Platform

ZooAi is a **full-stack AI-powered code editor and developer platform** designed to provide a modern development experience directly from the browser.

The platform combines **AI-powered coding assistance, project management, an online code editor, real-time collaboration, subscriptions, and scalable cloud infrastructure** using a production-style microservices architecture.

ZooAi is built to provide an experience similar to modern AI-powered development environments while maintaining a scalable and modular architecture.

---

## 🚀 What We're Building

In this project, we're building a **full-stack AI code editor** using a production-oriented architecture.

ZooAi combines:

* 🤖 AI-powered code generation
* 🧠 AI coding assistance
* 🧩 LangGraph agent workflows
* 💻 Browser-based code editor / IDE
* 📁 Project and file management
* ⚡ Real-time communication
* 🔐 Authentication & authorization
* 💳 Subscription and payment management
* 🚀 Microservices architecture
* ☁️ Cloud deployment infrastructure

The goal is to create a powerful development environment where developers can **build, edit, manage, and interact with their projects using AI**.

---

# 🧠 Technologies Used

### Frontend

* ⚛️ React.js
* ⚡ Vite
* 🎨 Modern responsive UI
* 💻 Online code editor / IDE experience

### Backend

* 🟢 Node.js
* 🚂 Express.js
* 🍃 MongoDB
* 🧩 Microservices Architecture

### AI

* 🧠 LangGraph
* 🤖 AI Agent Workflows
* 💡 AI-powered Code Generation
* 🧑‍💻 AI Coding Assistance

### Performance & Real-Time

* ⚡ Redis
* 🔄 Socket.IO
* 🚀 Caching
* 🔐 Session Management
* 📡 Real-time communication

### DevOps & Cloud

* 🐳 Docker
* 🐳 Docker Compose
* ☁️ AWS
* 🚀 Cloud Infrastructure
* 📦 Containerized Services

### Payments

* 💳 Razorpay
* 🔄 Subscription Management
* 💰 Payment Processing

### Security

* 🔐 Authentication
* 🛡️ Authorization
* 🔑 Secure session management
* 🔒 Protected resources

---

# ✨ Key Features

## 🤖 AI Code Generation

Generate code using AI directly inside the development environment.

ZooAi is designed to assist developers with:

* Code generation
* Code completion
* Code explanation
* Debugging assistance
* Refactoring
* Development suggestions

---

## 🧠 AI Agent Workflows

ZooAi uses **LangGraph** to build structured AI agent workflows.

This allows the system to handle complex development tasks through multiple AI-powered steps instead of relying only on simple prompts.

---

## 💻 Online Code Editor

ZooAi provides a browser-based development experience where users can:

* Create projects
* Create files
* Edit code
* Manage folders
* Work with multiple files
* Interact with AI assistance

The goal is to provide an IDE-like experience directly in the browser.

---

## 📁 Project & File Management

Users can manage their development projects directly through ZooAi.

Features include:

* Project creation
* Project management
* File creation
* File editing
* Folder organization
* Project-level resources

---

## 🔄 Real-Time Communication

**Socket.IO** enables real-time communication between services and clients.

This can be used for:

* Live AI responses
* Real-time updates
* Execution status
* Project events
* Collaborative experiences

---

## ⚡ Redis

Redis is used for high-performance operations such as:

* Caching
* Session management
* Temporary data
* Fast lookups
* Real-time application state

This helps improve application performance and scalability.

---

## 🧩 Microservices Architecture

ZooAi follows a modular **microservices architecture**.

Instead of building the entire backend as a single application, functionality can be separated into independent services.

This provides:

* Better scalability
* Service isolation
* Easier maintenance
* Independent deployments
* Better fault isolation
* Flexible infrastructure

---

## 🔐 Authentication & Authorization

ZooAi includes secure authentication and authorization mechanisms.

The platform is designed to support:

* User registration
* User login
* Protected routes
* Authorization
* Secure sessions
* User-specific projects and resources

---

## 💳 Payments & Subscriptions

ZooAi integrates **Razorpay** for payment processing and subscription-related functionality.

This allows the platform to support monetization features such as:

* Subscription plans
* Payment processing
* Plan upgrades
* Payment verification
* Subscription management

---

## 🐳 Dockerized Infrastructure

The application is designed to run using Docker and Docker Compose.

This makes it easier to:

* Run services consistently
* Manage development environments
* Isolate services
* Start multiple services together
* Prepare applications for deployment

---

## ☁️ AWS Deployment

ZooAi is designed with cloud deployment in mind using AWS infrastructure.

The architecture can support scalable deployment of:

* Frontend
* Backend services
* Microservices
* Databases
* Redis
* Containerized workloads

---

# 🏗️ Architecture

High-level architecture:

```text
                         ┌──────────────────┐
                         │      ZooAi       │
                         │   React + Vite   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    API Gateway   │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
       │ Auth Service│     │Project Svc  │     │  AI Service │
       └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
              │                   │                   │
              │                   │                   ▼
              │                   │            ┌─────────────┐
              │                   │            │  LangGraph  │
              │                   │            │ AI Agents   │
              │                   │            └─────────────┘
              │                   │
              └─────────────┬─────┴────────────────────┐
                            │                          │
                            ▼                          ▼
                     ┌─────────────┐            ┌─────────────┐
                     │   MongoDB   │            │    Redis    │
                     └─────────────┘            └─────────────┘

                            │
                            ▼
                     ┌─────────────┐
                     │  Socket.IO  │
                     └─────────────┘

                            │
                            ▼
                     ┌─────────────┐
                     │     AWS     │
                     └─────────────┘
```

---

# 📦 Core Modules

ZooAi is structured around several major modules:

### 👤 Authentication

User registration, login, authentication and authorization.

### 📁 Project Management

Create and manage development projects.

### 📄 File Management

Create, edit and organize project files.

### 💻 Code Editor

Browser-based IDE experience.

### 🤖 AI Assistant

AI-powered development assistance and code generation.

### 🧠 Agent Workflows

LangGraph-based AI workflows for complex coding tasks.

### ⚡ Real-Time Engine

Socket.IO-powered real-time events and communication.

### 💳 Subscription System

Razorpay-powered payments and subscriptions.

### ☁️ Infrastructure

Dockerized services with AWS deployment support.

---

# 🎯 Project Goals

The primary goals of ZooAi are:

* Build a production-style AI development platform
* Provide an intuitive browser-based coding experience
* Integrate AI directly into the development workflow
* Use scalable microservices architecture
* Implement real-time communication
* Build secure authentication and authorization
* Support subscription-based monetization
* Deploy using modern cloud infrastructure

---

# 🔥 Why ZooAi?

Traditional development environments require developers to switch between multiple tools for:

**Coding → Debugging → Documentation → AI Assistance → Project Management**

ZooAi aims to bring these capabilities together into one intelligent development environment.

> **Explore Intelligence. Create Without Limits.**

---

# 🛠️ Development

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd ZooAi
```

Install dependencies for the required services and applications.

Start the development environment using the project's configured commands or Docker Compose.

```bash
docker compose up --build
```

> Configuration and environment variables should be added according to the project setup.

---

# 🔐 Environment Variables

Create the required `.env` files for the respective services.

Typical configuration may include:

```env
NODE_ENV=development

MONGO_URI=your_mongodb_connection

REDIS_URL=your_redis_connection

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_KEY_SECRET=your_razorpay_secret

AWS_ACCESS_KEY_ID=your_aws_access_key

AWS_SECRET_ACCESS_KEY=your_aws_secret

AWS_REGION=your_aws_region

AI_API_KEY=your_ai_api_key
```

Never commit real secrets or credentials to GitHub.

---

# 🚀 Future Improvements

Planned improvements include:

* 🤖 Advanced AI coding agents
* 🧠 Multi-agent development workflows
* 🔍 Intelligent codebase understanding
* 🐛 AI-powered debugging
* 🧪 Automated testing assistance
* 📦 AI project generation
* 🔄 Real-time collaborative coding
* ☁️ Scalable cloud execution
* 📊 Developer analytics
* 🔐 Advanced security
* 🌐 Multi-language support

---

# 📌 Project Status

🚧 **Active Development**

ZooAi is currently under active development as a full-stack AI-powered development platform.

New features, architectural improvements, UI enhancements, and AI capabilities are continuously being added.

---

# 👨‍💻 Built With

**React.js • Vite • Node.js • Express.js • MongoDB • Microservices • LangGraph • Redis • Socket.IO • Docker • AWS • Razorpay**

---

## ⭐ Support

If you find ZooAi interesting, consider giving the repository a ⭐ and following the project as it continues to evolve.

**ZooAi — Explore Intelligence. Create Without Limits.**
