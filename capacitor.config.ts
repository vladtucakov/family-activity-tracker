import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familytracker.app',
  appName: 'Family Activity Tracker',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Always point to your Replit server for mobile builds
    url: 'https://tucakov-family-track-pro.replit.app',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_family_tracker",
      iconColor: "#2563EB",
      sound: "default"
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2563EB",
      showSpinner: false
    }
  }
};

export default config;