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

### Layout Structure Improvements
- **Fixed Sidebar**: Full viewport height with scrollable content
- **Fixed Header**: Positioned at top, full width aligned right of sidebar
- **Scrollable Content**: Independent scrolling for main content area
- **Logout Functionality**: Accessible logout button in sidebar
- **Mobile Responsive**: Proper mobile overlay and responsive design

### Voice Chat Integration
- **ElevenLabs Integration**: Real-time voice conversations with AI teachers
- **WebSocket Management**: Connection status indicators and error handling
- **Audio Visualization**: Real-time audio feedback during conversations
- **Agent Management**: Configured with agent ID: agent_01jxfp3s2fefq9cb27j6dw7mp0

### API Configuration
- **Enhanced Teacher API**: localhost:8090/api/v1 endpoint configuration
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
- `VITE_API_BASE_URL`: Enhanced Teacher API base URL
- `VITE_TUTORING_API_URL`: AI Tutoring Platform API URL
- `VITE_ELEVENLABS_API_KEY`: ElevenLabs API key
- `VITE_CLIENT_ID`: Authentication client ID

## Current State
The application is fully functional with:
- Complete authentication flow
- Fixed layout structure
- Voice chat capabilities
- Multiple API integrations
- Modern responsive design
- Protected route system