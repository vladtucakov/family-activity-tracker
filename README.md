# Family Activity Tracker

A comprehensive family activity tracking application built with React and Express, featuring native Android app capabilities and daily reminder notifications.

## 🎯 Overview

Transform your family's daily contributions into an engaging, gamified experience. Track activities across six categories, earn badges, maintain streaks, and stay motivated with automatic reminder notifications.

## ✨ Features

### Core Functionality
- **6 Activity Categories**: Household, Health, Creative, Learning, Helping, Play
- **Individual & Family Views**: Track personal progress and see family overview
- **Badge System**: Earn achievements for streaks, milestones, and consistency
- **Weekly Progress Tracking**: Visual calendar with activity completion status
- **Real-time Updates**: Instant synchronization across all family members

### Native Mobile App
- **Android App**: Built with Capacitor framework for native performance
- **Daily Reminders**: Native notifications at 8:00 PM Pacific Time
- **Offline Support**: Works without internet connection
- **Home Screen Installation**: Full PWA capabilities

### Technical Features
- **Pacific Time Zone Support**: Accurate date handling for West Coast families
- **PostgreSQL Database**: Reliable data persistence with Neon serverless
- **Responsive Design**: Works on all screen sizes
- **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Mobile**: Capacitor for native Android deployment
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI + shadcn/ui

## 🚀 Quick Start

### Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the app**:
   Open http://localhost:3000

### Android Build

1. **Build the web app**:
   ```bash
   npm run build
   ```

2. **Sync with Android project**:
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Build APK**: Use Android Studio to generate the APK file

## 🏠 Family Members

The app is configured for four family members:
- Andrea
- Sasha  
- Matti
- Vlad

## 📱 Activity Categories

1. **Household** 🏠 - Chores and home responsibilities
2. **Health** 💪 - Physical activities and wellness
3. **Creative** 🎨 - Arts, crafts, and creative projects
4. **Learning** 📚 - Educational activities and skill development
5. **Helping** 🤝 - Assisting others and community service
6. **Play** 🎮 - Fun activities and games

## 🏆 Badge System

Earn badges for:
- **Daily Streaks**: Consecutive days of activity
- **Category Focus**: Mastery in specific activity types
- **Weekly Goals**: Consistent weekly participation
- **Family Challenges**: Group achievements

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)

### Database Setup
The app uses Drizzle ORM with PostgreSQL. Run migrations with:
```bash
npm run db:push
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npx cap sync android` - Sync with Android project
- `npx cap open android` - Open Android Studio

## 🎨 Customization

The app uses Tailwind CSS for styling and can be customized by:
- Modifying colors in `tailwind.config.ts`
- Updating component styles in the `client/src/components` directory
- Adding new badge types in the database schema

## 📱 Notification System

- **Daily reminders** at 8:00 PM Pacific Time
- **Native Android notifications** for reliability
- **Smart targeting**: Only reminds users with fewer than 3 activities
- **Personalized messages** with family member names

## 🔒 Privacy

This is a private family application designed for personal use. All data is stored securely in your own PostgreSQL database.

## 📄 License

Private family project - not for distribution.

---

Built with ❤️ for family productivity and motivation.