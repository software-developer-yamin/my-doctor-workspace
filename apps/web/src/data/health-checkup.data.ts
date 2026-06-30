export type THealthCheckupCategory = {
  id: string;
  label: string;
};

export type TServiceProvider = {
  id: string;
  label: string;
};

export type THealthCheckupPackage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  category: "HEALTH_CHECKUP" | "INSURANCE";
  providerId: string;
};

export const HEALTH_CHECKUP_CATEGORIES: THealthCheckupCategory[] = [
  { id: "HEALTH_CHECKUP", label: "Health Checkups" },
  { id: "INSURANCE", label: "Insurance" },
];

export const SERVICE_PROVIDERS: TServiceProvider[] = [
  { id: "3", label: "Medix, Dhanmondi" },
  { id: "4", label: "Guardian Life Insurance Limited" },
  { id: "5", label: "No Chinta Ltd" },
  { id: "6", label: "PhysioZone Physiotherapy" },
  { id: "7", label: "Healthy Home" },
  { id: "8", label: "Popular Diagnostic Centre Ltd" },
  { id: "9", label: "Apollo Clinic Dhanmondi & JMI Specialized Hospital" },
];

export const HEALTH_CHECKUP_PACKAGES: THealthCheckupPackage[] = [
  {
    id: "6",
    slug: "comprehensive-health-check-up-package-for-female-includes-18-different-medical-tests",
    title: "Comprehensive Health Check-up Package for (Female) - 18 Tests",
    description: "Comprehensive Health Check-up Package for (Female) includes 18 different medical tests.",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwFgPQ/health-checkup-insurances/6/HUEwKQEgmxZKM8P5aWpNyp2Y8e66oTH39atm4Zbf/popular-diagnostic-centres-comprehensive-health-check-up-package-for-female-includes-18-different-medical-tests.webp",
    price: 12850,
    currency: "৳",
    category: "HEALTH_CHECKUP",
    providerId: "8",
  },
  {
    id: "5",
    slug: "comprehensive-health-check-up-package-for-male",
    title: "Comprehensive Health Check-up Package for (Male)",
    description: "Popular Diagnostic Centre's Comprehensive Health Check-up Package for (Male) includes 16 different medical tests.",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwFgPQ/health-checkup-insurances/5/TT16ZVaOadJxyi6E7tfyxduh6CHxDxxZHV33VHSc/comprehensive-health-check-up-package-for-male.webp",
    price: 10650,
    currency: "৳",
    category: "HEALTH_CHECKUP",
    providerId: "8",
  },
  {
    id: "1",
    slug: "executive-check-up-basic-male-18-tests",
    title: "Executive Check up Basic (Male) - 18 Tests",
    description: "Medix's Executive Check-Up Basic (Male) includes 18 different medical tests.",
    image: "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCwhlWD0/health-checkup-insurances/1/waHztq5cXgC24swXjJ0OJuZ8GSSOF6LQ55Yefc0L/executive-check-up-basic-male.webp",
    price: 8550,
    currency: "৳",
    category: "HEALTH_CHECKUP",
    providerId: "3",
  },
  {
    id: "8",
    slug: "executive-health-screening",
    title: "Executive Health Screening",
    description: "Health Check-up package includes 34 different medical tests.",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwFgPQ/health-checkup-insurances/8/qNW9S9UL70IHNRAEOTHQZnp481FfjtfTxZ731lAS/executive-health-screening.webp",
    price: 24000,
    currency: "৳",
    category: "HEALTH_CHECKUP",
    providerId: "9",
  },
  {
    id: "2",
    slug: "guardian-life-starter",
    title: "Guardian Life Starter",
    description: "For 1 year & 1 person by Guardian Life Insurance Limited.",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwhmXT0/health-checkup-insurances/2/WWOwBBwhtKYi9v3T3LR4GrtUleoHv5sgFueEi6Ty/guardian-life-starter.webp",
    price: 350,
    currency: "৳",
    category: "INSURANCE",
    providerId: "4",
  },
  {
    id: "7",
    slug: "health-check-up-package-for-40-years-above",
    title: "Health Check-up Package for 40 years Above",
    description: "Popular Diagnostic Centre's Health Check-up Package for 40 years Above, includes 16 different medical tests.",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwFgPQ/health-checkup-insurances/7/zh023FY7BWWLgVPZG4AseXT0X5Yi05V1dkB8xNkt/health-check-up-package-for-40-years-above.webp",
    price: 14630,
    currency: "৳",
    category: "HEALTH_CHECKUP",
    providerId: "8",
  },
  {
    id: "3",
    slug: "primary-health-check-up-package-11-tests",
    title: "Primary Health Check-up Package - 11 Tests",
    description: "Popular Diagnostic Centre's Primary Health Check-up Package includes 11 different medical tests.",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwFgPQ/health-checkup-insurances/3/WbpR32VLvkJAiOK1D5KgRyojKqSR2MZlF29DKvcJ/primary-health-check-up-package-11-tests.webp",
    price: 5900,
    currency: "৳",
    category: "HEALTH_CHECKUP",
    providerId: "8",
  },
  {
    id: "4",
    slug: "primary-health-check-up-package-14-tests",
    title: "Primary Health Check-up Package - 14 Tests",
    description: "Popular Diagnostic Centre's Primary Health Check-up Package includes 14 different medical tests.",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICFSpfVmcGCwFgPQ/health-checkup-insurances/4/55G2lcLxd351IE4fJ4YXZtjEqYpTXaZs5IF3C89W/primary-health-check-up-package-14-tests.webp",
    price: 7180,
    currency: "৳",
    category: "HEALTH_CHECKUP",
    providerId: "8",
  },
];
