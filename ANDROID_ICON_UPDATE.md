# Android Icon Branding Update Required

## Current Issue

Your Android app is still showing generic Capacitor icons because we need to replace the actual PNG files in the Android project. The branding configuration is correct, but the icon files themselves are still the default ones from July 10th.

## What Needs To Be Done

**1. Icon Background Color** ✅ Fixed
- Added `ic_launcher_background` color (#2563EB) to match Family Activity Tracker branding

**2. Icon Files** ❌ Still Generic
- All `ic_launcher*.png` files are still the default Capacitor icons
- Need to be replaced with Family Activity Tracker branded icons

## Current Icon Files That Need Replacement

```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png (48x48)
android/app/src/main/res/mipmap-hdpi/ic_launcher.png (72x72)
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png (96x96)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png (144x144)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png (192x192)

Plus foreground and round versions for each size
```

## Solution Options

**Option 1: Use Android Icon Generator**
1. Go to Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload a Family Activity Tracker logo/design
3. Generate all required sizes
4. Replace the existing PNG files

**Option 2: Create Custom Design**
- Use the SVG I created (create_app_icon.svg) as a base
- Convert to PNG at required Android sizes
- Replace existing files manually

**Option 3: Simple Text-Based Icon**
- Create simple icon with "FAT" or family symbol
- Blue background (#2563EB), white text/symbols

## After Replacing Icons

Once you replace the icon files:

```bash
# Sync changes
npx cap sync android

# Open Android Studio  
npx cap open android

# Clean and rebuild
Build → Clean Project
Build → Generate Signed Bundle/APK → APK
```

## Expected Result

After rebuilding and installing:
- ✅ Home screen shows Family Activity Tracker branded icon
- ✅ App drawer displays custom icon with app name
- ✅ Notification icons use branded colors
- ✅ Professional family app appearance

The generic Capacitor robot icon will be replaced with proper Family Activity Tracker branding once you rebuild with the new icon files.