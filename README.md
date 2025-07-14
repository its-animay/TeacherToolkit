# Enhanced Teacher API React Application

A comprehensive React application for managing AI teachers with full CRUD operations, advanced search, and detailed teacher profiles integrated with the Enhanced Teacher API.

## Features

### Core Functionality
- **Complete Teacher Management**: Create, read, update, and delete AI teacher profiles
- **Advanced Search & Filtering**: Search by name, domain, teaching style, and personality traits
- **Real-time Analytics**: Performance metrics, session tracking, and rating analytics
- **Interactive Chat Demo**: Test teacher personalities with sample conversations
- **API Configuration**: Dynamic API endpoint configuration with connection testing

### Enhanced Teacher API Integration
- **Full API Compatibility**: Integrated with all Enhanced Teacher API endpoints
- **Dynamic Configuration**: Environment-based API URL configuration with localStorage override
- **Error Handling**: Comprehensive error boundaries and network failure recovery
- **Validation**: Client-side form validation matching API requirements

### Modern UI/UX
- **Gradient Design System**: Professional gradients, glass effects, and animations
- **Responsive Layout**: Mobile-first design with sidebar navigation
- **Step-by-step Forms**: Multi-step teacher creation with progress indicators
- **Loading States**: Skeleton loading and spinner components
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with hot module replacement

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd enhanced-teacher-api-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your Enhanced Teacher API URL
VITE_API_BASE_URL=https://your-enhanced-teacher-api.com
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## API Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Base URL for the Enhanced Teacher API

### Dynamic Configuration
Users can override the API URL through the Settings page, which stores the configuration in localStorage with this priority:
1. localStorage setting (user override)
2. Environment variable
3. Default fallback

### API Endpoints Used

The application integrates with these Enhanced Teacher API endpoints:

- `GET /enhanced-teacher/` - List all teachers
- `POST /enhanced-teacher/` - Create new teacher
- `GET /enhanced-teacher/{id}` - Get specific teacher
- `PUT /enhanced-teacher/{id}` - Update teacher
- `DELETE /enhanced-teacher/{id}` - Delete teacher
- `GET /enhanced-teacher/search` - Search teachers with filters
- `GET /enhanced-teacher/domain/{domain}` - Get teacher by domain
- `POST /enhanced-teacher/{id}/rating` - Add teacher rating
- `POST /enhanced-teacher/{id}/increment-session` - Track sessions
- `POST /enhanced-teacher/{id}/generate-prompt` - Generate system prompts
- `POST /enhanced-teacher/create-defaults` - Create default teachers
- `GET /enhanced-teacher/styles/all` - Get available styles and traits

## Project Structure

```
├── client/src/
│   ├── components/          # Reusable UI components
│   │   ├── chat/           # Chat interface components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   ├── teachers/       # Teacher-specific components
│   │   └── ui/             # Base UI components (shadcn/ui)
│   ├── contexts/           # React contexts for state management
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries and API clients
│   ├── pages/              # Page components
│   └── main.tsx            # Application entry point
├── server/                 # Express server for development
├── shared/                 # Shared schemas and types
└── attached_assets/        # API documentation and test data
```

## Key Components

### Teacher Management
- **TeacherForm**: Multi-step form with validation for creating/editing teachers
- **TeacherList**: Grid and list views for browsing teachers
- **TeacherCard**: Individual teacher profile cards with actions
- **TeacherDetail**: Detailed teacher profile view

### Pages
- **Dashboard**: Overview with quick stats and recent teachers
- **TeachersPage**: Complete teacher management interface
- **CreateTeacherPage**: Step-by-step teacher creation
- **SearchPage**: Advanced search and filtering
- **AnalyticsPage**: Performance metrics and insights
- **ChatDemoPage**: Interactive chat interface
- **SettingsPage**: API configuration and testing

### Error Handling
- **Global Error Boundary**: Catches unhandled promise rejections
- **API Error States**: User-friendly error messages with retry options
- **Network Error Detection**: Automatic fallback for connection issues
- **Form Validation**: Real-time validation with helpful error messages

## Enhanced Teacher API Validation

The application enforces Enhanced Teacher API validation requirements:

### Personality Traits
Must be one of: `encouraging`, `patient`, `challenging`, `humorous`, `formal`, `casual`, `analytical`, `creative`

### Question Frequency
Must be one of: `high`, `medium`, `low`

### Humor Usage
Must be one of: `frequent`, `occasional`, `rare`, `never`

### System Prompt Template
Must contain the `{personality}` placeholder along with other required template variables.

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Consistent naming conventions
- Component-based architecture

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or Replit. Ensure your Enhanced Teacher API URL is properly configured in the environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues related to the Enhanced Teacher API integration, check the Settings page for connection testing and troubleshooting options.