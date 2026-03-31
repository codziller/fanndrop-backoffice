import type { AppSettings } from '@/types/models';

export const DEMO_SETTINGS: AppSettings = {
  appVersion: {
    ios: '2.4.1',
    android: '2.4.1',
  },
  forceUpdate: {
    enabled: false,
    iosMinVersion: '2.0.0',
    androidMinVersion: '2.0.0',
    iosUpdateUrl: 'https://apps.apple.com/app/fanndrop/id123456789',
    androidUpdateUrl: 'https://play.google.com/store/apps/details?id=com.fanndrop',
    updateMessage: 'A new version of Fanndrop is available with exciting features and improvements. Please update to continue.',
  },
  maintenanceMode: {
    enabled: false,
    message: "We're performing scheduled maintenance to improve your experience. We'll be back shortly!",
    scheduledStart: '',
    scheduledEnd: '',
  },
  featureFlags: {
    enable_stories: true,
    enable_polls: true,
    enable_campaigns: true,
    enable_video_feed: true,
  },
  dropPackages: [
    { id: '1', name: 'Starter',  drops: 50,    priceNaira: 500,    chargesNaira: 50,    active: true },
    { id: '2', name: 'Basic',    drops: 200,   priceNaira: 1_800,  chargesNaira: 150,   active: true },
    { id: '3', name: 'Standard', drops: 500,   priceNaira: 4_000,  chargesNaira: 300,   active: true },
    { id: '4', name: 'Premium',  drops: 1_000, priceNaira: 7_500,  chargesNaira: 500,   active: true },
    { id: '5', name: 'Ultra',    drops: 5_000, priceNaira: 35_000, chargesNaira: 2_000, active: true },
  ],
  general: {
    platformName: 'Fanndrop',
    supportEmail: 'support@fanndrop.com',
    tosUrl: 'https://fanndrop.com/terms',
    privacyUrl: 'https://fanndrop.com/privacy',
  },
};
