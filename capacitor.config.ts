// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cyclopedia.edu',   // نفس المعرّف الحالي
  appName: 'KidCyclopedia',         // نفس الاسم الحالي
  webDir: 'dist',                // يتوافق مع مخرجات vite build لديك
  server: {
    androidScheme: 'https'
  },
  // توصيات اختيارية مفيدة لتجربة التطبيق:
  android: {
    allowMixedContent: false   // أمان أعلى - لا نسمح بتحميل http داخل https
  },
  ios: {
    contentInset: 'always',    // تجنّب قصّ المحتوى أسفل الـ notch
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
