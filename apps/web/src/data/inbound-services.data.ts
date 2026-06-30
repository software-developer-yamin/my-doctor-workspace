import { 
  HealthIcon, 
  StethoscopeIcon, 
  PackageIcon, 
  Shield02Icon 
} from "@hugeicons/core-free-icons";

export type TInboundService = {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  bgColor: string;
};

export const INBOUND_SERVICES_DATA: TInboundService[] = [
  {
    id: "physiotherapy",
    title: "Physiotherapy",
    description: "Licensed medical professionals providing physical therapy to reduce pain and regain mobility at home.",
    icon: HealthIcon,
    href: "#",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "sample-collection",
    title: "Sample Collection",
    description: "Hassle-free home sample collection for all diagnostic tests with high accuracy and care.",
    icon: StethoscopeIcon,
    href: "/diagnostics",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: "checkup-package",
    title: "Checkup Packages",
    description: "Preventive health checkup packages tailored for your lifestyle and medical history.",
    icon: PackageIcon,
    href: "/health-checkup-services",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    id: "health-insurance",
    title: "Health Insurance",
    description: "Get financial support during medical emergencies with our comprehensive insurance plans.",
    icon: Shield02Icon,
    href: "#",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];
