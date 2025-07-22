# Step-by-Step Android Build Guide

## Step 3: Build and Open Your Android Project

After installing Android Studio, here's exactly what to do:

### 3.1 Build the Web App First
```bash
# Open terminal/command prompt in your project folder
npm run build
```
**What this does:** Creates optimized web files in `dist/public/` folder

### 3.2 Sync Web App to Android Project
```bash
npx cap sync android
```
**What this does:** 
- Copies your web app into the Android project
- Updates Android plugins
- Prepares everything for Android Studio

### 3.3 Open in Android Studio
```bash
npx cap open android
```
**What this does:** Opens Android Studio with your project loaded

## Troubleshooting Common Issues

### Issue 1: "Command not found" error
**Solution:** Make sure you're in the correct project folder
```bash
# Navigate to your project folder first
cd path/to/your/family-tracker-project
```

### Issue 2: Android Studio doesn't open
**Solution:** 
1. Make sure Android Studio is installed and launched at least once
2. Try opening manually: Android Studio → Open → Select the `android` folder

### Issue 3: Build errors in Android Studio
**Solution:**
1. Let Android Studio download any missing SDK components
2. Wait for "Gradle sync" to complete (shows in bottom status bar)
3. Click "Sync Now" if prompted

## What You'll See in Android Studio

1. **Project loads** - You'll see your "Family Activity Tracker" project
2. **Gradle sync** - Android Studio downloads dependencies (takes a few minutes first time)
3. **Green play button** - Appears when ready to build/run

## Next Steps After Opening

1. **Connect Android device** or start emulator
2. **Click green play button** to install and test
3. **Build APK** via Build → Build Bundle(s)/APK(s) → Build APK(s)

## Alternative: Manual Method

If the command doesn't work:
1. Open Android Studio manually
2. Click "Open an existing project"
3. Navigate to your project folder
4. Select the `android` folder (not the root folder)
5. Click "OK"

The Android project is already fully set up with your family activity tracker app and native notifications ready to go!