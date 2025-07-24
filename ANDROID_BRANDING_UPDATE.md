# Family Activity Tracker - Android App Branding

## Current Status

✅ **App Name**: Correctly shows "Family Activity Tracker"  
✅ **Package ID**: com.familytracker.app  
❌ **App Icon**: Using generic Capacitor icons (needs Family Activity Tracker branding)  
❌ **Splash Screen**: Using default Capacitor splash (needs custom branding)

## What Needs To Be Updated

The Android app currently uses generic Capacitor icons. For proper Family Activity Tracker branding, we need:

1. **Custom App Icon** - Family-themed icon with activity symbols
2. **Proper Colors** - Match the blue theme (#2563EB) from the web app
3. **Splash Screen** - Branded loading screen when app opens

## Icon Design Concept

The Family Activity Tracker icon should feature:
- **Family Symbol**: Representing multiple family members
- **Activity Elements**: Icons suggesting household, health, creative, learning activities  
- **Blue Color Scheme**: Matching the app's #2563EB primary color
- **Clean Design**: Works well at all Android icon sizes (48dp to 192dp)

## How to Update the Branding

### Step 1: Generate Custom Icons
Use an icon generator service or design tool to create:
- **ic_launcher.png** (multiple sizes: 48dp, 72dp, 96dp, 144dp, 192dp)
- **ic_launcher_round.png** (adaptive icon for newer Android versions)
- **ic_launcher_foreground.png** (foreground layer for adaptive icons)

### Step 2: Replace Default Icons
Copy the new icons to replace existing files in:
- `android/app/src/main/res/mipmap-mdpi/` (48dp)
- `android/app/src/main/res/mipmap-hdpi/` (72dp)  
- `android/app/src/main/res/mipmap-xhdpi/` (96dp)
- `android/app/src/main/res/mipmap-xxhdpi/` (144dp)
- `android/app/src/main/res/mipmap-xxxhdpi/` (192dp)

### Step 3: Update Colors
Edit `android/app/src/main/res/values/colors.xml` to match app theme:
```xml
<color name="colorPrimary">#2563EB</color>
<color name="colorPrimaryDark">#1D4ED8</color>
<color name="colorAccent">#2563EB</color>
```

### Step 4: Rebuild and Install
```bash
npm run build
npx cap sync android
npx cap open android
# Build → Generate Signed Bundle/APK → APK
```

## Expected Result

After updating:
- ✅ **Home Screen**: Shows Family Activity Tracker icon with custom design
- ✅ **App Drawer**: Displays branded icon with "Family Activity Tracker" name
- ✅ **Notifications**: Use branded icons for better recognition
- ✅ **Professional Appearance**: Looks like a polished family app

The app will maintain all current functionality while having proper Family Activity Tracker visual branding throughout the Android experience.