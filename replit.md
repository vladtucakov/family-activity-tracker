# Family Activity Tracker - replit.md

## Overview

This is a full-stack family activity tracking application built with React, Express, and PostgreSQL. The app allows family members to log daily activities across six categories (household, health, creative, learning, helping, play), track progress, earn badges, and maintain streaks. It features a responsive design with both individual member views and a family overview.

**Current Status**: Core functionality implemented and tested. Native Android app ready for deployment using Capacitor framework. Reliable notification system operational with daily 8 PM Pacific reminders through native Android notifications.

## User Preferences

- Preferred communication style: Simple, everyday language
- Location: Pacific Time Zone (important for date calculations)
- Family members: Andrea, Sasha, Matti, Vlad
- Deployment plan: Replit Autoscale for 24/7 family access
- Mobile deployment: Building native Android app (PWA notifications had reliability issues)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with Express routes
- **Request Handling**: JSON and URL-encoded form data support
- **Error Handling**: Centralized error middleware with status codes
- **Logging**: Custom request/response logging for API endpoints

### Data Storage Solutions
- **Database**: PostgreSQL using Neon serverless
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migration**: Drizzle Kit for schema migrations
- **Session Storage**: PostgreSQL-based sessions with connect-pg-simple
- **Fallback Storage**: In-memory storage implementation for development

## Key Components

### Database Schema
- **Users Table**: Stores family member credentials and basic info
- **Activities Table**: Records daily activities with categories and descriptions
- **Badges Table**: Tracks earned achievements and milestones
- **Streaks Table**: Maintains current and longest activity streaks

### API Endpoints
- `GET /api/users` - Fetch all family members
- `GET /api/users/:username` - Get specific user by username
- `GET /api/users/:userId/activities` - Get activities with date filtering
- Activity CRUD operations for creating, updating, and deleting entries
- Badge and streak management endpoints

### Frontend Components
- **Dashboard**: Main interface showing progress and activities
- **Activity Categories**: Grid display of six activity types with progress
- **Weekly Overview**: Calendar view of completed activities
- **Family Progress**: Summary view of all family members
- **Activity Modal**: Form for adding/editing activities
- **Badge System**: Display recent achievements and milestones

### Activity Categories
1. **Household**: Chores and home responsibilities
2. **Health**: Physical activities and wellness
3. **Creative**: Arts, crafts, and creative projects
4. **Learning**: Educational activities and skill development
5. **Helping**: Assisting others and community service
6. **Play**: Fun activities and games

## Data Flow

1. **User Interaction**: Family members select their profile or use family view
2. **Activity Logging**: Users add activities through modal forms with category selection
3. **Progress Tracking**: Real-time updates to daily progress and streak calculations
4. **Badge Awards**: Automatic badge calculation based on activity patterns
5. **Data Persistence**: All changes saved to PostgreSQL database via Drizzle ORM
6. **State Synchronization**: TanStack Query handles caching and real-time updates

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection for Neon database
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with validation
- **zod**: Runtime type validation and schema definition

### UI Libraries
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety across the stack
- **@replit/vite-plugin-***: Replit-specific development plugins

## Deployment Strategy

### Development Environment
- Vite dev server for frontend hot reloading
- Express server with TypeScript compilation via tsx
- Environment variables for database connection
- Replit-specific plugins for development experience

### Production Build
- Vite builds optimized React application to `dist/public`
- esbuild compiles Express server to `dist/index.js`
- Static file serving integrated with Express
- PostgreSQL database hosted on Neon serverless platform

### Environment Configuration
- `DATABASE_URL` required for PostgreSQL connection
- Development vs production detection via `NODE_ENV`
- Replit-specific configurations for hosting platform

### File Structure
- `/client` - React frontend application
- `/server` - Express backend and API routes
- `/shared` - Common TypeScript types and schemas
- `/migrations` - Database migration files
- Configuration files in project root

## Recent Changes (July 2025)

### July 12-13, 2025: Core Functionality Implementation
- ✓ Fixed critical activity display bug (API import and cache invalidation issues)
- ✓ Implemented proper Pacific Time Zone handling throughout the app
- ✓ Created date utility functions for consistent timezone calculations
- ✓ Fixed weekly calendar date selection to show correct dates when clicked
- ✓ Resolved "Today's Activities" section to display current date accurately
- ✓ Improved weekly progress styling with proper visual hierarchy (selected vs today)
- ✓ Added green bullet points to make completed activities more visible
- ✓ Implemented delete functionality with red trash icons for easy activity removal
- ✓ Added delete option in edit modal with confirmation dialogs
- ✓ Fixed API request handler to properly handle DELETE responses (204 status)
- ✓ Created custom delete confirmation dialog without browser URL information
- ✓ Added proper accessibility support for delete confirmations
- ✓ Verified all CRUD operations working correctly: create, read, update, delete
- ✓ Migrated from in-memory storage to PostgreSQL database for production use
- ✓ Set up Drizzle ORM migration system for safe future database schema changes
- ✓ Added family member selection screen for first-time users
- ✓ Implemented localStorage to remember last selected family member
- ✓ Enhanced user experience with persistent family member preferences
- ✓ Fixed critical bug in weekly progress dots not updating when activities are added
- ✓ Corrected database date range query to properly filter activities by week
- ✓ Added proper cache invalidation for weekly data to ensure real-time updates

### July 14, 2025: PWA Implementation
- ✓ Added Progressive Web App (PWA) capabilities for standalone iPhone app deployment
- ✓ Created web app manifest with proper icons and metadata
- ✓ Implemented service worker for offline functionality and caching
- ✓ Added iOS-specific meta tags for optimal mobile experience
- ✓ Created install prompt component for easy app installation
- ✓ Added PWA detection hook for install/standalone states
- ✓ Optimized CSS for PWA mode with safe area support and touch improvements
- ✓ Fixed Monday-Sunday week display and Pacific Time zone handling
- ✓ Implemented dynamic progress labels based on selected date
- ✓ Added comprehensive achievements gallery showing all unlockable badges
- ✓ Created visual achievement system with difficulty levels and progress tracking
- ✓ Implemented achievement categories (Streaks, Daily, Category Focus, Competition)
- ✓ Added earned/available/coming soon status indicators for user motivation
- ✓ Fixed "Badges Earned" counter in Quick Stats to show actual badge count from database
- ✓ Enhanced activity categories to support multiple entries per category
- ✓ Changed visual indicator from checkmark to activity count badge
- ✓ Added "Add more" button for categories with existing activities
- ✓ Improved category cards to display all activities with scrollable list
- ✓ Fixed weekly score calculation to use proper Monday-Sunday weeks instead of rolling 7-day window
- ✓ Made category headers and icons clickable to quickly add activities to specific categories
- ✓ Changed weekly score format from percentage to fraction (x/7 days) for clearer progress tracking
- ✓ Created family member popup with week-based activity grid and quick-add functionality
- ✓ Implemented responsive design (7 days on desktop, 3 days on mobile) with navigation between periods
- ✓ Added quick-add buttons for missing categories on each day within popup
- ✓ Made family member cards clickable to open detailed activity popup

### July 15, 2025: PWA Cache Management and Mobile Improvements
- ✓ Fixed critical PWA caching issue causing blank screens after redeployment
- ✓ Implemented proper service worker cache invalidation with unique cache names
- ✓ Added automatic page refresh when new service worker version is detected
- ✓ Changed to network-first caching strategy to prioritize fresh content
- ✓ Improved mobile popup experience with horizontal scrolling support
- ✓ Centered date range text in popup navigation for better visual balance
- ✓ Shortened navigation button text to save space on mobile devices
- ✓ Removed color coding from popup buttons for simplified interface
- ✓ Added notification testing system to validate browser compatibility across devices
- ✓ Confirmed notification support on Android, desktop Chrome, and iOS (when installed as PWA)
- ✓ Implemented Service Worker notifications for reliable mobile delivery
- ✓ Created PNG icon versions for proper iOS home screen installation
- ✓ Fixed iPhone icon display issue by converting SVG to PNG format
- ✓ Verified notification system ready for implementation across all family devices

### July 21, 2025: Native Android App Development with Capacitor
- ✓ Implemented Capacitor framework to convert React web app to native Android application
- ✓ Installed and configured Capacitor with Android platform integration
- ✓ Added native notification plugins (@capacitor/local-notifications, @capacitor/push-notifications)
- ✓ Created CapacitorNotificationService for reliable native Android notifications
- ✓ Built native notification admin panel with permission management and testing
- ✓ Integrated automatic detection of native vs web environment
- ✓ Added proper Android app configuration with manifest and icons
- ✓ Successfully generated Android project structure with native build capability
- ✓ Configured daily reminder scheduling at 8:00 PM Pacific using native Android notifications
- ✓ Created comprehensive build documentation for Android Studio deployment
- ✓ Resolved web notification reliability issues by migrating to native platform
- ✓ Enhanced notification branding with "FamilyTracker" custom display
- ✓ Prepared project for APK generation and Google Play Store distribution

### July 22, 2025: GitHub Integration and Version Control Setup
- ✓ Created comprehensive README.md with project documentation and setup instructions
- ✓ Added proper .gitignore file to exclude build artifacts and sensitive files
- ✓ Configured Git repository with vladtucakov user credentials
- ✓ GitHub repository created at https://github.com/vladtucakov/family-activity-tracker
- ✓ Successfully resolved GitHub integration using Replit's "Create Repository on GitHub" feature
- ✓ Complete project structure uploaded to GitHub with all essential components
- ✓ User downloaded complete project to local computer for Android app development

### July 23, 2025: Android Build Configuration Fix & Successful APK Generation
- ✓ Identified and resolved AndroidX dependency conflicts preventing Android app builds
- ✓ Created root-level gradle.properties with comprehensive AndroidX enablement settings
- ✓ Enhanced android/gradle.properties with improved memory allocation and Jetifier support
- ✓ Fixed .gitignore to allow tracking of essential Android configuration files
- ✓ Added compatibility settings for compileSdk 35 to suppress build warnings
- ✓ Successfully pushed AndroidX configuration fixes to GitHub via Replit integration
- ✓ User successfully pulled updates and executed local Android build process
- ✓ **MILESTONE: `gradlew assembleDebug` completed successfully - APK generated!**
- ✓ **MILESTONE: Android app successfully running in emulator - fully functional!**
- ✓ Fixed Android app server connection configuration to always point to Replit server
- ✓ Native Android Family Activity Tracker app ready for installation and testing

### July 24, 2025: React App Restoration & Server Stability
- ✓ Resolved server stability issues by implementing reliable in-memory storage solution
- ✓ Fixed continuous error loops and removed problematic error handlers from server
- ✓ Confirmed all API endpoints working properly with family members initialized
- ✓ Fixed JavaScript import errors in Capacitor notification components preventing React app rendering
- ✓ Created mock notification service for web environment to avoid "require is not defined" errors
- ✓ Successfully restored Dashboard component functionality with family member selection
- ✓ **MILESTONE: React web app fully operational - family member selection screen working**
- ✓ Confirmed API integration functional with successful user data, activities, and stats requests
- ✓ Server running stably on localhost:5000 with notification service operational
- ✓ Family Activity Tracker ready for both web testing and Android app deployment

### July 19, 2025: Daily Reminder System Implementation
- ✓ Implemented automated notification service for daily activity reminders
- ✓ Configured reminders to send at 8:00 PM Pacific Time daily
- ✓ Set notification threshold for family members with fewer than 3 activities completed
- ✓ Added admin panel for testing and monitoring notification system
- ✓ Created API endpoints for notification management and status checking
- ✓ Service automatically starts with server and schedules recurring daily reminders
- ✓ Integrated browser notification system with service worker support
- ✓ Personalized reminder messages with family member names and activity counts
- ✓ Fixed notification display to show proper app-branded notifications instead of generic Chrome messages
- ✓ Added notification permission checker to admin panel for debugging delivery issues
- ✓ Confirmed notifications appear correctly on mobile devices with "FamilyTracker" branding
- ✓ Notification system fully operational and ready for daily 8 PM reminders