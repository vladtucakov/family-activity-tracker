# Android App Icon File Locations

## 📁 Where to Find Your Branding Files

### **Main App Icons (Square)**
These control the app icon on home screen and app drawer:

```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png        (48x48px)
android/app/src/main/res/mipmap-hdpi/ic_launcher.png        (72x72px)
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png       (96x96px)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png      (144x144px)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png     (192x192px)
```

### **Round App Icons (Circular)**
These are used on some Android launchers that prefer round icons:

```
android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png        (48x48px)
android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png        (72x72px)
android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png       (96x96px)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png      (144x144px)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png     (192x192px)
```

### **Foreground Icons (Adaptive)**
These are used for Android 8.0+ adaptive icons:

```
android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png        (48x48px)
android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png        (72x72px)
android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png       (96x96px)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png      (144x144px)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png     (192x192px)
```

## ✅ Updated Status (July 26, 2025)

**All icon files now updated with Family Activity Tracker branding:**
- ✅ ic_launcher.png files - Custom Family Activity Tracker icons
- ✅ ic_launcher_round.png files - Custom icons for round launchers
- ✅ ic_launcher_foreground.png files - Custom icons for adaptive launchers

## 🔄 How to Verify on Your Computer

After you pull the latest changes (`git pull origin main`), check these files:

1. **Navigate to your local project:**
   ```
   C:\Users\vtuca\Family Tracker\family-activity-tracker\android\app\src\main\res\
   ```

2. **Check file dates in each mipmap folder:**
   - Files dated July 26, 2025 = ✅ Updated with custom branding
   - Files dated July 10, 2025 = ❌ Old generic Capacitor icons

3. **Look for these folders:**
   ```
   mipmap-mdpi/
   mipmap-hdpi/
   mipmap-xhdpi/
   mipmap-xxhdpi/
   mipmap-xxxhdpi/
   ```

## 📱 When You'll See the New Branding

**After rebuilding with `gradlew assembleDebug`:**
- ✅ Home screen app icon - Your custom Family Activity Tracker design
- ✅ App drawer icon - Same custom design
- ✅ Recent apps view - Branded app icon
- ✅ Settings > Apps - Custom icon in app list
- ✅ Notification icons - Branded notifications

All icon variations are now updated, so your Family Activity Tracker will have consistent custom branding throughout Android!