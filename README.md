# 💬 Chit-Chat

### A modern full-stack real-time messaging application

Chit-Chat is a full-stack web application built for private, one-to-one communication between users. It combines persistent messaging, real-time communication, authentication, media sharing, and responsive UI in a modern MERN-based architecture.

The project demonstrates the implementation of a complete client-server application using **React, Node.js, Express, MongoDB, Socket.IO, and Cloudinary**.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io\&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)

---

## Live Application

**Live Demo:**
https://chit-chat-a-fullstack-chat-app-2.onrender.com/

**Source Code:**
https://github.com/M-Ehthisham18/Chit-Chat-A-fullstack-chat-app

> The application is hosted on Render. Free-tier services may require a short startup period after inactivity.

---

## Overview

Chit-Chat provides a simple direct-messaging experience where users can discover other available users and start private conversations.

Unlike a public chatroom or community messaging system, the application is centered around **one-to-one conversations**.

The application uses REST APIs for authentication, user and message operations, while **Socket.IO** provides the real-time communication layer required for live messages and presence updates.

---

## Features

### Authentication

* User registration
* Secure login and logout
* JWT-based authentication
* Password hashing with bcrypt
* Protected application routes
* Persistent authenticated sessions
* Guest account access
* Guest account re-login support

### Direct Messaging

* One-to-one private conversations
* Persistent message history
* Real-time message delivery with Socket.IO
* Conversation selection from the user list
* Text messaging
* Image sharing
* Message data stored in MongoDB

### User Experience

* Online/offline user presence
* Responsive chat interface
* User profile management
* Profile image support
* Profile information updates
* Account deletion
* Toast notifications and user feedback
* Modern responsive styling

---

## Tech Stack

| Layer                | Technologies          |
| -------------------- | --------------------- |
| **Frontend**         | React 19, Vite        |
| **Routing**          | React Router          |
| **State Management** | Zustand               |
| **Styling**          | Tailwind CSS, DaisyUI |
| **HTTP Client**      | Axios                 |
| **Real-Time Client** | Socket.IO Client      |
| **Backend**          | Node.js, Express      |
| **Database**         | MongoDB, Mongoose     |
| **Authentication**   | JWT, bcrypt           |
| **Real-Time Server** | Socket.IO             |
| **Media Storage**    | Cloudinary            |
| **Deployment**       | Render                |

---

## Architecture

Chit-Chat follows a client-server architecture with separate frontend and backend application layers.

```text
┌───────────────────────────────┐
│           Frontend            │
│                               │
│ React + Vite                  │
│ Zustand                       │
│ Tailwind CSS + DaisyUI        │
│ Axios                         │
│ Socket.IO Client              │
└───────────────┬───────────────┘
                │
          HTTP / WebSocket
                │
                ▼
┌───────────────────────────────┐
│            Backend            │
│                               │
│ Node.js + Express             │
│ REST API                      │
│ JWT Authentication            │
│ Socket.IO Server              │
└───────────┬─────────┬─────────┘
            │         │
            ▼         ▼
    ┌────────────┐  ┌────────────┐
    │  MongoDB   │  │ Cloudinary │
    │            │  │            │
    │ Users      │  │ Images     │
    │ Messages   │  │ Media      │
    └────────────┘  └────────────┘
```

### Request flow

REST APIs handle operations such as:

* authentication;
* user management;
* retrieving conversations;
* retrieving message history;
* sending and storing messages;
* profile operations.

Socket.IO maintains persistent connections between active clients and the backend to support real-time events such as:

* incoming messages;
* user connections;
* user disconnections;
* online presence updates.

---

## Project Structure

```text
Chit-Chat-A-fullstack-chat-app/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── seeds/
│   │
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── package.json
└── README.md
```

The repository separates the application into independent frontend and backend packages while providing root-level scripts for production builds and startup.

---

## Getting Started

### Prerequisites

Make sure the following are installed or available before running the project:

* Node.js
* npm
* MongoDB database
* Cloudinary account

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/M-Ehthisham18/Chit-Chat-A-fullstack-chat-app.git
```

Move into the project:

```bash
cd Chit-Chat-A-fullstack-chat-app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Configuration

Create a `.env` file inside the `backend` directory.

Use the provided `.env.example` file as the reference for the required environment variables.

The backend requires configuration for services such as:

```env
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Additional environment-specific configuration should follow the values documented in `.env.example`.

> Never commit real credentials, API keys, database connection strings, or production secrets to source control.

---

## Running Locally

### Start the backend

From the `backend` directory:

```bash
npm run dev
```

The development server runs the Express backend using Nodemon.

### Start the frontend

Open another terminal and navigate to:

```bash
cd frontend
```

Then run:

```bash
npm run dev
```

Vite will start the frontend development server.

Open the local URL displayed by Vite in your browser.

---

## Production Build

The root project contains a build command that installs both application packages and creates the frontend production bundle.

From the repository root:

```bash
npm run build
```

The production server can then be started with:

```bash
npm start
```

The backend is responsible for running the server-side application and supporting the deployed frontend/API communication.

---

## Security

The application applies several common web application security practices:

* passwords are hashed rather than stored as plain text;
* JWT is used for authenticated requests;
* protected backend routes require authentication;
* authentication logic is handled server-side;
* sensitive configuration is stored using environment variables;
* database credentials and service keys should never be committed to Git;
* media uploads are delegated to Cloudinary rather than stored directly in the repository.

---

## Real-Time Communication

Socket.IO is used as the application's real-time transport layer.

When users connect to the application, the backend maintains socket connections that can be associated with authenticated users.

This allows the application to deliver events without repeatedly polling the API.

```text
User A
  │
  │ Send message
  ▼
Socket.IO Client
  │
  ▼
Socket.IO Server
  │
  ├── Persist message → MongoDB
  │
  └── Emit message → User B
                       │
                       ▼
                 Socket.IO Client
                       │
                       ▼
                    User B
```

Persistent storage and real-time delivery work together: MongoDB preserves conversation history while Socket.IO handles immediate communication between connected users.

---

## Image Sharing

Chit-Chat supports media-based conversations in addition to regular text messages.

Images are handled through Cloudinary, which keeps media storage separate from the application server and database.

```text
Client
  │
  ▼
Backend
  │
  ▼
Cloudinary
  │
  ▼
Image URL
  │
  ▼
Message Record
  │
  ▼
MongoDB
```

---

## Development Goals

This project is being continuously improved with emphasis on:

* reliable real-time communication;
* clean client-server separation;
* secure authentication;
* maintainable backend APIs;
* responsive user experience;
* dependable message persistence;
* production deployment reliability;
* safe handling of user and media data.

The goal is not only to provide a functioning chat interface, but to demonstrate the engineering involved in maintaining a full-stack, stateful, real-time web application.

---

## Roadmap

Planned improvements include:

* [ ] Block and unblock users
* [ ] Expanded automated testing
* [ ] Improved real-time connection recovery
* [ ] Additional accessibility improvements
* [ ] Further production monitoring and reliability improvements

---

## Contributing

This repository is primarily maintained as a personal development and portfolio project.

Suggestions, bug reports, and constructive feedback are welcome through GitHub Issues.

If you would like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the affected functionality.
5. Submit a pull request with a clear description of the change.

---

## Author

**Ehthisham Ul Haq**

GitHub: [@M-Ehthisham18](https://github.com/M-Ehthisham18)

---

## License

This project is currently distributed under the **ISC License** as declared in the project's package configuration.

---

<p align="center">
  Built as a full-stack real-time web application using React, Node.js, MongoDB and Socket.IO.
</p>
