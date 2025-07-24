import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familytracker.app',
  appName: 'Family Activity Tracker',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Always point to your Replit server for Android builds
    url: 'https://tucakov-family-track-pro.replit.app',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#2563EB"
    }
  }
};

export default config;