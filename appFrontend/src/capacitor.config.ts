import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'sac',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
