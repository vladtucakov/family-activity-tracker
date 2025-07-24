# How to Install Family Activity Tracker on Your Android Phone

## Quick Setup (Recommended)

### Step 1: Download the Project
1. Go to https://github.com/vladtucakov/family-activity-tracker
2. Click the green "Code" button → "Download ZIP"
3. Extract the ZIP file to your computer

### Step 2: Install Android Studio
1. Download Android Studio from https://developer.android.com/studio
2. Install it with default settings
3. Open Android Studio and let it finish setup

### Step 3: Build the App
1. Open Terminal/Command Prompt in your extracted project folder
2. Run these commands:
```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

### Step 4: Build APK in Android Studio
1. Android Studio will open with your project
2. Wait for "Gradle sync" to complete (bottom status bar)
3. Click **Build** menu → **Generate Signed Bundle / APK**
4. Choose **APK** (not Bundle)
5. Create a new keystore or use existing one
6. Click **Finish** and wait for build to complete

### Step 5: Install on Your Phone
1. Enable **Developer Options** on your Android phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect your phone to computer with USB cable
3. In Android Studio, click **Run** button (green triangle)
4. Select your phone from the device list
5. The app will install automatically

## Alternative: Manual APK Install

If the above doesn't work, you can install the APK file directly:

1. After building, find the APK file at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

2. Copy this file to your phone (via USB, email, or cloud storage)

3. On your phone:
   - Go to Settings → Security
   - Enable "Install from Unknown Sources" or "Unknown Apps"
   - Open the APK file and tap "Install"

## What You'll Get

Your installed app will:
- ✅ Connect to your family's data at tucakov-family-track-pro.replit.app
- ✅ Show all your stored activities and progress
- ✅ Send native Android notifications at 8 PM Pacific Time
- ✅ Work offline and sync when connected
- ✅ Access all family members' data and streaks

## Troubleshooting

**App won't install:** Make sure "Unknown Sources" is enabled in phone settings

**Can't connect to data:** Check your internet connection and verify the server is running

**No notifications:** Grant notification permissions when the app asks

**Build errors:** Make sure you have Java 17+ installed and Android Studio is updated

## Next Steps

1. Install on each family member's Android phone
2. Test logging activities and verify they sync to the web app
3. Set up notification permissions for daily reminders
4. Start tracking your family's activities!

Your Family Activity Tracker is ready to replace your Google Sheets workflow with a proper mobile app experience.