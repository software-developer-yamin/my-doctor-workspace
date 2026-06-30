/**
 * Page Feature Configuration
 * This file manages the metadata and activation status of all primary routes.
 */

export type TPageFeature = {
  enabled: boolean;
  name: string;
  description?: string;
  launchDate?: string; // Optional: when the feature is expected to be live
};

export const PAGE_FEATURES: Record<string, TPageFeature> = {
  // Integrated Backend Pages
  "/": { enabled: true, name: "Home" },
  "/doctors": { enabled: true, name: "Doctor Booking" },
  "/hospitals": { enabled: true, name: "Hospital Search" },
  "/ambulances": { enabled: true, name: "Ambulance Service" },
  "/telemedicine": { enabled: true, name: "Telemedicine" },
  "/specializations": { enabled: true, name: "Specializations" },
  "/search": { enabled: true, name: "Global Search" },
  "/diagnostics": { enabled: true, name: "Diagnostics" },
  "/diagnostic-labs": { enabled: true, name: "Diagnostic Labs" },
  "/guides": { enabled: true, name: "Hospital Guide" },

  // Pending / Under Development Pages
  "/nurses": {
    enabled: false,
    name: "Nursing Services",
    description:
      "Our certified nursing services are currently being synced with our updated medical database to ensure the highest care standards.",
    launchDate: "May 2026",
  },
  "/diagnostic-home-services": {
    enabled: false,
    name: "Home Diagnostics",
    description:
      "We are expanding our network of mobile phlebotomists to bring laboratory services directly to your doorstep soon.",
  },
  "/health-checkup-services": {
    enabled: false,
    name: "Full Health Checkups",
    description:
      "Curated health packages for your family are being finalized with our partner hospitals and diagnostic centers.",
  },
  "/domiciliary-services": {
    enabled: false,
    name: "Domiciliary Care",
    description:
      "Professional residential healthcare services are currently being audited for quality assurance.",
  },
  "/pharmacy": {
    enabled: false,
    name: "Online Pharmacy",
    description:
      "We are partnering with verified pharmacies to deliver authentic medicines safely to your location.",
  },
  "/offers": {
    enabled: false,
    name: "Healthcare Offers",
    description:
      "Exciting discounts and healthcare bundles are on their way! Check back for seasonal promotions.",
  },
  "/nursing-home-service": {
    enabled: false,
    name: "Nursing Home Care",
    description:
      "Professional nursing assistance at your home is coming soon with verified specialists.",
  },
};

/**
 * Helper to get the feature configuration for a given path
 */
export const getPageFeature = (path: string): TPageFeature | undefined => {
  const matchingPath = Object.keys(PAGE_FEATURES)
    .filter((p) => path === p || path.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length)[0];

  return matchingPath ? PAGE_FEATURES[matchingPath] : undefined;
};

/**
 * Helper to check if a path's feature is enabled
 */
export const isPageEnabled = (path: string): boolean => {
  const feature = getPageFeature(path);
  return feature ? feature.enabled : true;
};
