import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familytracker.app',
  appName: 'Family Activity Tracker',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // For production, point to your Replit server
    url: process.env.NODE_ENV === 'production' ? undefined : 'https://family-activity-tracker--vladtucakov.replit.app',
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