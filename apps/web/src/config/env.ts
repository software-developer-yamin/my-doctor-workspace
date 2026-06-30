export const ENV = {
  // Public variables (Prefixed with NEXT_PUBLIC_)
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  NEXT_PUBLIC_ASSETS_URL:
    process.env.NEXT_PUBLIC_ASSETS_URL || "https://admin.mydoctor.com.bd",

  // Auth related
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  // Features toggle
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_MAINTENANCE_MODE:
    process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE === "true",

  // Server-side only variables (DO NOT prefix with NEXT_PUBLIC_)
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
};
