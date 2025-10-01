# AI Assistant Chat Application

A full-featured AI chat application built with Next.js 15, React 19, TypeScript, and TailwindCSS. This application provides a seamless conversational interface with AI models, featuring persistent chat history, document management, and a responsive UI.

## Table of Contents

- [What is this project?](#what-is-this-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
  - [Vercel Deployment](#vercel-deployment)
  - [Electron Desktop App](#electron-desktop-app)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## What is this project?

This is a comprehensive AI chat application that allows users to have intelligent conversations with various AI models. The application features a modern, responsive UI with real-time chat capabilities, persistent conversation history, document management, and user authentication. 

Built with cutting-edge technologies, it provides a production-ready solution for integrating AI assistants into web applications. The app supports multiple AI providers including OpenAI, Anthropic, and Google Gemini, allowing users to switch between different models based on their needs.

## Key Features

- 🤖 **Multi-AI Model Support**: Integration with OpenAI, Anthropic, and Google Gemini
- 💬 **Real-time Chat Interface**: Smooth, responsive conversational experience
- 📚 **Persistent Chat History**: Save and retrieve past conversations
- 🔐 **User Authentication**: Secure login and session management
- 📁 **Document Management**: Upload, organize, and reference documents in chats
- 🎨 **Modern UI/UX**: Built with TailwindCSS and shadcn/ui components
- 🌐 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Performance Optimized**: Fast loading and smooth interactions
- 🌙 **Dark/Light Theme**: Automatic theme switching based on system preference
- 📊 **Analytics Dashboard**: Track usage statistics and conversation metrics
- 🖥️ **Desktop Application**: Electron-based desktop version available

## Technology Stack

### Frontend
- **Next.js 15** - React-based framework with App Router
- **React 19** - Latest version of the React library
- **TypeScript** - Type-safe JavaScript development
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible UI components built with Radix UI
- **Framer Motion** - Animation library for React

### Backend
- **Next.js API Routes** - Serverless functions for API endpoints
- **Node.js** - JavaScript runtime environment
- **Prisma** - Next-generation ORM for database management

### Database
- **PostgreSQL** - Relational database for storing user data and conversations

### AI Providers
- **OpenAI** - GPT models integration
- **Anthropic** - Claude models integration
- **Google Generative AI** - Gemini models integration

### Development & Build Tools
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Webpack Bundle Analyzer** - Bundle size optimization
- **Electron** - Cross-platform desktop application framework

## Architecture Overview

The application follows a modern full-stack architecture with a clear separation of concerns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend/API    │    │   Database      │
│                 │    │                  │    │                 │
│  Next.js 15     │◄──►│  Next.js API     │◄──►│  PostgreSQL     │
│  React 19       │    │  Routes          │    │                 │
│  TypeScript     │    │  Prisma Client   │    │                 │
│  TailwindCSS    │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                         ▲                      ▲
         │                         │                      │
         ▼                         ▼                      ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AI Services   │    │   Auth System    │    │   Storage       │
│                 │    │                  │    │                 │
│  OpenAI         │    │  NextAuth.js     │    │  File Storage   │
│  Anthropic      │    │                  │    │                 │
│  Google Gemini  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL database
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workspace
```

2. Install dependencies:
```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# AI Provider Keys (optional, add as needed)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_key
```

### Database Setup

1. Push the Prisma schema to your database:
```bash
npm run db:push
```

2. Generate Prisma client:
```bash
npm run db:generate
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
workspace/
├── backend/                 # Backend server files
│   ├── api/                 # API route handlers
│   └── lib/                 # Backend utilities
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Main dashboard application
│   │   └── ...              # Other pages
│   ├── components/          # React components
│   │   ├── chat/            # Chat-specific components
│   │   ├── layout/          # Layout components
│   │   ├── settings/        # Settings components
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and services
│   └── types/               # TypeScript types
├── docs/                    # Documentation files
└── scripts/                 # Utility scripts
```

## Core Components

### Frontend

#### Main Dashboard
- **Sidebar**: Navigation and chat history
- **Chat Interface**: Real-time conversation with AI
- **Document Manager**: Upload and manage reference documents
- **Settings Panel**: Configure AI models and preferences

#### Key Components
- `SidebarChatHistory`: Displays conversation history with delete/pin options
- `ChatHistory`: Main chat interface component
- `Navbar`: Top navigation bar with user profile
- `UserProfile`: User account management

### Backend

#### API Routes
- `/api/conversations`: Manage chat conversations
- `/api/chat`: Handle chat completions with AI models
- `/api/auth`: Authentication endpoints
- `/api/documents`: Document management

#### Services
- Database service for CRUD operations
- AI service for model integrations
- Authentication service for user management

### Database

#### Models
- **User**: User account information
- **Conversation**: Chat conversations with metadata
- **Message**: Individual messages within conversations
- **Post**: Blog posts (if applicable)

## API Endpoints

### Conversations
- `GET /api/conversations` - Retrieve all conversations
- `POST /api/conversations` - Create a new conversation
- `GET /api/conversations/[id]` - Retrieve a specific conversation
- `DELETE /api/conversations/[id]` - Delete a conversation
- `PUT /api/conversations/[id]` - Update conversation metadata

### Chat
- `POST /api/chat/completion` - Get AI response for a message

### Authentication
- `/api/auth/*` - NextAuth.js authentication routes

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

### Electron Desktop App

Build the desktop application:
```bash
npm run electron-pack
```

The packaged application will be available in the `dist/` directory.

## Testing

Run linting checks:
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.