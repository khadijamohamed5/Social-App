# 🚀 Social App Backend

A scalable backend for a social media platform built with **Node.js, Express.js, TypeScript, MongoDB, Redis, GraphQL, Socket.IO, and AWS S3**.

The application provides both **REST APIs** and a **GraphQL endpoint**, allowing clients to choose the most suitable communication style.

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB & Mongoose
* Redis
* GraphQL
* Socket.IO
* JWT
* Zod
* AWS S3
* Firebase Admin
* Nodemailer

---

## ✨ Features

### 🔐 Authentication

* JWT Authentication
* Email OTP Verification
* Login & Signup
* Forgot Password
* Change Password
* Logout with Token Blacklisting
* Password hashing using Bcrypt
* AES-256-CBC phone number encryption

### 📝 Posts

* Create, Update, Delete and Retrieve Posts
* AWS S3 File Uploads
* Emoji Reactions
* Threaded Discussions

### 💬 Comments

* Nested Replies
* Mentions
* Comment Reactions
* Automatic Comment Count Synchronization

### 👥 Friends

* Send Friend Requests
* Accept / Reject Requests
* Custom Friend Relationships

### 💬 Realtime Chat

- Private Chats
- Group Chats
- Chat History
- Online Presence Tracking
- Redis Session Management
- Instant Message Delivery with Socket.IO

### 🌐 GraphQL

REST APIs are available for all application features, while GraphQL is supported for querying users, posts, and comments through a dedicated endpoint.

### 🔔 Notifications

* Firebase Cloud Messaging (FCM)
* HTML Email Templates
* Nodemailer Integration

### ☁️ Storage

Secure media upload and retrieval using AWS S3.

---


## 📁 Project Structure

The project follows a modular architecture using the **Repository Pattern** and **Dependency Injection**.

Each feature is organized into its own module containing:

* Controller
* Service
* Repository
* DTOs
* Validation
* GraphQL (when applicable)

External services such as AWS S3, Firebase, Redis, and Email Providers are abstracted through providers to improve maintainability and scalability.

---

## 🔒 Security

* JWT Authentication
* Password Hashing with Bcrypt
* AES-256-CBC Data Encryption
* Request Validation using Zod
* Role-Based Authorization
* Token Blacklisting using Redis

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/khadijamohamed5/Social-App.git
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file and provide all required environment variables.

### Start the development server

```bash
npm run dev
```

### Build the project

```bash
npm run build
```

### Run the production build

```bash
npm start
```
