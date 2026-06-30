export type TDomiciliaryService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  features: string[];
};

export const DOMICILIARY_CATEGORIES = [
  { id: "nursing", label: "Nursing Care" },
  { id: "physiotherapy", label: "Physiotherapy" },
  { id: "elderly-care", label: "Elderly Care" },
  { id: "baby-care", label: "Baby Care" },
  { id: "specialized", label: "Specialized Care" },
];

export const DOMICILIARY_SERVICES: TDomiciliaryService[] = [
  {
    id: "1",
    slug: "home-nursing-care",
    title: "Home Nursing Care",
    description: "Professional nursing care at the comfort of your home. Includes wound dressing, IV management, and vitals monitoring.",
    price: 1500,
    currency: "BDT",
    category: "nursing",
    image: "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCw9jPQ/inbound-services/1/SBRSgZaQxDxzkcJtfgogzCV6Akoyr7Vd3Hvr55lo/physiotherapy-service-at-home.webp",
    features: ["Certified Nurses", "12/24 Hour Shifts", "Medical Supervision"],
  },
  {
    id: "2",
    slug: "physiotherapy-at-home",
    title: "Physiotherapy at Home",
    description: "Expert physiotherapists providing personalized rehabilitation programs for stroke, sports injuries, and chronic pain.",
    price: 1200,
    currency: "BDT",
    category: "physiotherapy",
    image: "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCw9jPQ/inbound-services/1/SBRSgZaQxDxzkcJtfgogzCV6Akoyr7Vd3Hvr55lo/physiotherapy-service-at-home.webp",
    features: ["Pain Management", "Mobility Training", "Post-Surgery Rehab"],
  },
  {
    id: "3",
    slug: "elderly-caregiving",
    title: "Elderly Caregiving",
    description: "Compassionate caregivers to assist the elderly with daily activities, medication reminders, and companionship.",
    price: 2000,
    currency: "BDT",
    category: "elderly-care",
    image: "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCw9jPQ/inbound-services/3/z6x4kINbIMLHZRw7FCqV6OVQevg5t9mOcjC6EzP8/buy-health-checkup-package.webp",
    features: ["Daily Assistance", "Hygiene Care", "Companionship"],
  },
  {
    id: "4",
    slug: "post-operative-care",
    title: "Post-Operative Care",
    description: "Specialized home care for patients recovering from surgery to ensure fast and safe recovery.",
    price: 1800,
    currency: "BDT",
    category: "specialized",
    image: "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfVmcGCw9jPQ/inbound-services/2/NWCAFiHjaBPWSAMcIrodw7CVI4HtI7DCrcK47C42/home-sample-collection-for-lab-test.webp",
    features: ["Wound Care", "Medication Management", "Recovery Tracking"],
  },
];
