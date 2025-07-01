import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.comunity.app',
  appName: 'Comunity App',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://backendcomunity.onrender.com',
      'http://localhost:*'
    ]
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
