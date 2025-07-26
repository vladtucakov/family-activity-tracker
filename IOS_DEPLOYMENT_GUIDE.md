# iOS Native App Deployment Guide

## Requirements

**Essential:**
- **Mac Computer** (macOS required for iOS development)
- **Xcode** (free from Mac App Store, ~5GB download)
- **Apple ID** (free account works for testing)

**Optional for Distribution:**
- **Apple Developer Program** ($99/year for App Store or TestFlight distribution)

## Step 1: Setup on Mac

```bash
# Install Xcode from Mac App Store
# After installation, open Terminal:
xcode-select --install

# Clone your project
git clone https://github.com/vladtucakov/family-activity-tracker.git
cd family-activity-tracker

# Install dependencies
npm install

# Build and sync iOS
npm run build
npx cap sync ios
npx cap open ios
```

## Step 2: Configure in Xcode

**Set Bundle Identifier:**
1. Select "App" project in left sidebar
2. Under "Signing & Capabilities":
   - Team: Select your Apple ID
   - Bundle Identifier: `com.familytracker.app`

**Verify Capabilities (already configured):**
- ✅ Background Modes
- ✅ Push Notifications
- ✅ App Transport Security

## Step 3: Build Options

### Option A: Test on Your Device (Recommended)
1. **Connect iPhone/iPad** via USB cable
2. **Trust Computer** on device when prompted
3. **Select Device** in Xcode toolbar (next to play button)
4. **Click Play Button** ▶️ to build and install
5. **Trust Developer** in Settings → General → VPN & Device Management

### Option B: iOS Simulator
1. **Select Simulator** (iPhone 15, etc.) from Xcode toolbar
2. **Click Play Button** ▶️ to build and run in simulator
3. **Test Functionality** (notifications work in simulator)

## Step 4: Family Distribution

### TestFlight (Best for Families)
**Requirements:** Apple Developer Program ($99/year)

1. **Archive App:**
   - Product → Archive in Xcode
   - Upload to App Store Connect

2. **Create TestFlight Build:**
   - Add family members as testers
   - Send invite links via email/text

3. **Family Installation:**
   - Install TestFlight app from App Store
   - Tap invite link to install Family Activity Tracker

### Direct Device Installation (Free)
1. **Build to each device** directly in Xcode
2. **Limitations:**
   - Requires physical access to each device
   - Certificates expire after 7 days (free account)
   - Limited to your personal Apple ID

### App Store (Public)
**Requirements:** Apple Developer Program ($99/year)
1. **Submit for Review** (typically 1-2 days)
2. **Public Download** - anyone can install "Family Activity Tracker"

## Step 5: Testing iOS Features

Once installed:
1. **Grant Permissions** - Allow notifications when iOS prompts
2. **Test Notifications** - Use admin panel "Send Test Notification"
3. **Verify Data Sync** - Activities sync with Replit server
4. **Schedule Reminders** - Enable 8 PM Pacific daily notifications

## Expected iOS App Features

- **Native iOS Interface** - Proper iOS look and feel
- **Native Notifications** - Daily 8 PM Pacific reminders
- **Background Processing** - Notifications work when app is closed
- **Data Synchronization** - Real-time sync with Android and web versions
- **Family Activity Tracking** - All 6 categories and streak tracking

## Troubleshooting

**Build Errors:**
- Ensure Bundle Identifier is unique: `com.familytracker.app`
- Check Apple ID is signed in: Xcode → Preferences → Accounts

**Device Installation Issues:**
- Trust developer certificate in iOS Settings
- Enable Developer Mode in iOS Settings (iOS 16+)

**Notification Issues:**
- Grant notification permissions when prompted
- Check iOS Settings → Notifications → Family Activity Tracker

## Result

Your family will have:
- **Android App** ✅ (already working)
- **iOS App** ✅ (native iPhone/iPad app)
- **Web Version** ✅ (still available)
- **Unified Data** - All platforms sync to same database

The Family Activity Tracker will work perfectly across all Apple devices with the same reliable notification system!