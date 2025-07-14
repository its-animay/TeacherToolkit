# AI Teachers Management Platform

## Project Overview
A comprehensive React application for managing AI teachers through multiple API integrations including Enhanced Teacher API, AI Tutoring Platform API, and ElevenLabs Conversational AI. The application features teacher management, chat interfaces, voice conversations, analytics, and modern responsive design with complete authentication flow.

## Technology Stack
- **Frontend**: React.js with TypeScript
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Routing**: Wouter with protected routes
- **Authentication**: JWT-based with refresh tokens
- **APIs**: Enhanced Teacher API, AI Tutoring Platform API, ElevenLabs Conversational AI

## Recent Changes (January 2025)

### Authentication System Implementation
- **Login/Logout Flow**: Complete authentication system with Redux integration
- **Protected Routes**: All application routes secured with authentication checks
- **Token Management**: Automatic token refresh and secure storage
- **Redux Store**: User state management with persist functionality
- **API Integration**: Axios interceptors for authentication headers

### Layout Structure Overhaul
- **Fixed Layout System**: Implemented proper fixed sidebar, header, and scrollable content
- **Sidebar**: Fixed position, full viewport height (100vh), scrollable content
- **Header**: Fixed at top, positioned right of sidebar (left-64), full width
- **Main Content**: Independent scrolling with proper spacing (mt-16, ml-64)
- **Responsive Design**: Mobile-first approach with proper breakpoints

### Instructor Management System
- **New Page**: "Instructor Management" replaces "All Teachers" in navigation
- **API Integration**: Connected to https://mordernera.com/api/v1/instructor endpoints
- **Instructor CRUD**: Create, read, update, delete instructor functionality
- **Create AI Teacher**: Direct integration to convert instructors to AI teachers
- **Authentication**: Bearer token authentication for all instructor API calls

### Voice Chat Integration
- **ElevenLabs Integration**: Real-time voice conversations with AI teachers
- **WebSocket Management**: Connection status indicators and error handling
- **Audio Visualization**: Real-time audio feedback during conversations
- **Agent Management**: Configured with agent ID: agent_01jxfp3s2fefq9cb27j6dw7mp0

### API Configuration
- **Enhanced Teacher API**: https://mordernera.com/api/v1 endpoint configuration
- **Instructor API**: https://mordernera.com/api/v1/instructor for instructor management
- **AI Tutoring Platform**: Chat sessions, knowledge base, RAG responses
- **ElevenLabs API**: Voice conversation capabilities with proper authentication

## User Preferences
- **Design System**: Modern gradient design with glass effects
- **Layout**: Fixed sidebar and header with scrollable content areas
- **Authentication**: Complete login/logout flow with protected routes
- **API Integration**: Multiple API services with proper error handling

## Architecture Notes
- **Authentication**: JWT tokens with refresh mechanism
- **State Management**: Redux for user state, React Query for API data
- **Layout**: Fixed positioning for sidebar/header, scrollable content
- **API Services**: Centralized API service layer with interceptors
- **Environment**: Vite-based development with proper environment variables

## Environment Variables
- `VITE_API_BASE_URL`: Enhanced Teacher API base URL (https://mordernera.com/api/v1)
- `VITE_INSTRUCTOR_API_URL`: Instructor Management API URL
- `VITE_TUTORING_API_URL`: AI Tutoring Platform API URL
- `VITE_ELEVENLABS_API_KEY`: ElevenLabs API key
- `VITE_CLIENT_ID`: Authentication client ID

## Current State
The application is fully functional with:
- Complete authentication flow with protected routes
- Fixed layout structure (sidebar, header, scrollable content)
- Instructor management system with API integration
- Voice chat capabilities with ElevenLabs
- Multiple API integrations with proper authentication
- Modern responsive design with gradient effects
- Create AI Teacher functionality from instructor profiles