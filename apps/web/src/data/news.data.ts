export type TNewsAuthor = {
  name: string;
  credentials?: string;
};

export type TNewsItem = {
  id: string;
  title: string;
  image: string;
  publishedAt: string;
  href: string;
  slug: string;
  category: string;
  badge?: string;
  content: string[];
  author?: TNewsAuthor;
};

export const NEWS_DATA: Record<string, TNewsItem[]> = {
  Event: [
    {
      id: "e1",
      slug: "health-wellness-expo-2026",
      title: "Health & Wellness Expo 2026",
      image: "/images/blogs/wellness_expo_2026.png",
      publishedAt: "12 Apr, 2026",
      href: "/blogs/health-wellness-expo-2026",
      category: "Event",
      author: { name: "My Doctor Editorial Team" },
      content: [
        "The Health & Wellness Expo 2026 is Bangladesh's largest annual healthcare gathering, bringing together over 200 hospitals, diagnostic centres, pharmaceutical companies, and wellness brands under one roof at the Bashundhara International Convention City, Dhaka.",
        "This year's expo focuses on preventive healthcare, digital health innovation, and affordable medical access for all Bangladeshis. Attendees can expect free health screenings, live demonstrations of the latest medical equipment, and expert panel sessions on topics ranging from cardiac care to mental health.",
        "My Doctor will be present at Stall C-14 with free telemedicine consultations, app demonstrations, and exclusive membership offers for expo visitors. Our medical team will be available throughout the event to answer questions about appointment booking, specialist referrals, and our live queue system.",
        "The expo runs from 12–14 April 2026, 9:00 AM to 7:00 PM daily. Entry is free for all visitors. We encourage everyone to bring their family members for the free blood pressure, blood glucose, and BMI screening offered at the My Doctor stall.",
      ],
    },
    {
      id: "e2",
      slug: "free-cardiology-screening-camp",
      title: "Free Cardiology Screening Camp",
      image: "/images/blogs/cardiology_screening_camp.png",
      publishedAt: "20 May, 2026",
      href: "/blogs/free-cardiology-screening-camp",
      category: "Event",
      author: { name: "My Doctor Editorial Team" },
      content: [
        "My Doctor, in partnership with the National Institute of Cardiovascular Diseases (NICVD), is hosting a free cardiology screening camp on 20 May 2026 at Narsingdi District Hospital. The camp is open to all residents of Narsingdi and surrounding upazilas.",
        "Cardiovascular disease is the leading cause of death in Bangladesh, yet many patients do not receive timely diagnosis due to the high cost of specialist consultations and diagnostic tests. This camp aims to bridge that gap by providing free ECG, blood pressure measurement, cholesterol screening, and cardiologist consultations — all at no cost to the patient.",
        "The screening camp will be staffed by five board-certified cardiologists and 12 trained nurses. Patients identified with high-risk conditions will be given a priority referral letter for follow-up care at NICVD Dhaka, with My Doctor facilitating the appointment booking process.",
        "Registration is open until 18 May 2026. Patients can register through the My Doctor app or by calling our helpline at +8801974-200905. Walk-ins will also be accepted on a first-come, first-served basis from 8:00 AM on the day of the camp.",
      ],
    },
  ],
  News: [
    {
      id: "n1",
      slug: "my-doctor-reaches-one-million-milestone",
      title: "My Doctor Reaches 1 Million Milestone",
      image: "/images/blogs/one_million_milestone.png",
      publishedAt: "15 Jan, 2026",
      href: "/blogs/my-doctor-reaches-one-million-milestone",
      category: "News",
      author: { name: "My Doctor Editorial Team" },
      content: [
        "My Doctor has officially crossed the 1,000,000 registered patient milestone, making it Bangladesh's fastest-growing digital healthcare platform. The milestone was reached on 15 January 2026, less than 18 months after the platform's public launch.",
        "The platform now connects patients with over 3,000 verified doctors across 64 districts of Bangladesh, spanning more than 40 medical specialities. On average, My Doctor facilitates over 15,000 consultations per month, with patients booking appointments via the web platform, Android and iOS apps, and through our WhatsApp booking channel.",
        "\"Reaching one million patients is a proud moment for the team, but it is just the beginning,\" said the CEO of My Doctor. \"Our mission is to ensure that every Bangladeshi — whether in Dhaka or in a remote upazila — can access a qualified doctor within minutes. We are doubling our doctor network and expanding to 20 new districts in 2026.\"",
        "To celebrate the milestone, My Doctor is offering free first consultations to all new patients who register before 31 January 2026. Existing patients will receive a 20% discount on their next booking as a token of appreciation for their trust and support.",
      ],
    },
  ],
  Offers: [
    {
      id: "o1",
      slug: "flat-30-off-full-body-checkup",
      title: "Flat 30% Off on Full Body Checkup",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053",
      publishedAt: "01 May, 2026",
      href: "/blogs/flat-30-off-full-body-checkup",
      category: "Offers",
      badge: "Limited Offer",
      author: { name: "My Doctor Team" },
      content: [
        "For the month of May 2026, My Doctor is offering a flat 30% discount on comprehensive full body health checkup packages at all partner diagnostic centres. This offer is valid for new patients booking through the My Doctor app or website between 1–31 May 2026.",
        "The full body checkup package includes Complete Blood Count (CBC), Fasting Blood Glucose, HbA1c, Lipid Profile, Liver Function Tests, Kidney Function Tests, Thyroid Profile (TSH, T3, T4), Urine Routine, Chest X-Ray, and ECG. Reports are delivered digitally within 24 hours of sample collection.",
        "This offer is available at 35 partner diagnostic centres across Dhaka, Chittagong, Narsingdi, and Sylhet. To avail the discount, simply book your checkup through the My Doctor app and apply the promo code HEALTH30 at checkout. No additional payments or referral letters are required.",
        "This offer is limited to one booking per patient and cannot be combined with other promotional discounts. Book before 31 May 2026 to secure your slot. Early morning appointments (7:00–9:00 AM) are available for fasting tests at all partner centres.",
      ],
    },
  ],
};

export function getNewsItemBySlug(slug: string): TNewsItem | null {
  for (const items of Object.values(NEWS_DATA)) {
    const found = items.find((item) => item.slug === slug);
    if (found) return found;
  }
  return null;
}

export function getAllNewsSlugs(): string[] {
  return Object.values(NEWS_DATA)
    .flat()
    .map((item) => item.slug);
}
