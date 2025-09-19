import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.kidcyclopedia',
  appName: 'Kidcyclopedia',
  webDir: 'dist',
  server: {
    url: 'https://cyclopedia-edu.web.app',
    androidScheme: 'https',
    cleartext: false
  }
};

export default config;
