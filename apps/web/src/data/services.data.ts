export type TServiceCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

export const HOME_SERVICES: TServiceCard[] = [
  {
    id: "doctor-appointment",
    title: "Doctor Appointment",
    description: "Book appointments with verified doctors instantly",
    image: "/images/services/default-service.png",
    href: "/doctors",
  },
  {
    id: "online-consultation",
    title: "Online Consultation",
    description: "Consult with doctors from home via video call",
    image: "/images/services/default-service-1.png",
    href: "/doctors?method=ONLINE",
  },
  {
    id: "emergency-ambulance",
    title: "Emergency Ambulance",
    description: "24/7 emergency ambulance service at your doorstep",
    image: "/images/services/default-service-2.png",
    href: "/ambulances",
  },
  {
    id: "hospital-finder",
    title: "Hospital Finder",
    description: "Find nearby hospitals and healthcare facilities",
    image: "/images/services/default-service-3.png",
    href: "/hospitals",
  },
  {
    id: "home-healthcare",
    title: "Home Healthcare",
    description: "Professional nursing and care services at home",
    image: "/images/services/default-service-4.png",
    href: "/doctors?method=HOME_VISIT",
  },
  {
    id: "diagnostic-test",
    title: "Medical Records",
    description: "Access and manage all your health records securely",
    image: "/images/services/default-service-5.png",
    href: "/diagnostics",
  },
];

export const RECENT_SEARCHES = [
  "Laparoscopic Urology",
  "Treatment Of Erectile Dysfunction",
  "bioidentical hormone therapies for men and women",
  "Adrenal Disorders",
];
