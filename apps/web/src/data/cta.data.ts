export type TCTAData = {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  image: string;
};

export const HOME_CTA_PRIMARY_CARE: TCTAData = {
  title: "Need a doctor to visit your loved one at home?",
  description:
    "Our 'Home-Centric Primary Care' program brings experienced doctors and paramedics to your doorstep with necessary medical equipment to ensure premium care for your family.",
  buttonText: "Book Home Visit",
  href: "/doctors",
  image: "/images/cta/home-visit-doctor.png",
};

export const HOME_CTA_EXPERT_SUGGESTION: TCTAData = {
  title: "Need expert medical advice for your health conditions?",
  description:
    "Consult with our highly experienced medical specialists to get deep insights and personalized treatment suggestions for complex health concerns.",
  buttonText: "Find Specialists",
  href: "/doctors",
  image: "/images/cta/expert-medical-suggestion.png",
};
