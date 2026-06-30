export type TPartnerCategory =
  | "All"
  | "Diagnostics"
  | "Hospitals"
  | "Emergency"
  | "Technology"
  | "Therapy";

export type TPartnerPageItem = {
  id: string;
  name: string;
  image: string;
  href?: string;
  category: Exclude<TPartnerCategory, "All">;
  description: string;
};

export const PARTNER_CATEGORIES: TPartnerCategory[] = [
  "All",
  "Hospitals",
  "Diagnostics",
  "Emergency",
  "Technology",
  "Therapy",
];

export const PARTNERS_PAGE_DATA: TPartnerPageItem[] = [
  {
    id: "1",
    name: "Popular Diagnostic Centre",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/1/bP93Wa8SQW7s8orKGu5dCIaNAv6qXRp8kyi1ltIH/popular-diagnostic-centre-limited.webp",
    href: "https://www.populardiagnostic.com/",
    category: "Diagnostics",
    description: "Bangladesh's largest diagnostic chain with over 50 branches, offering pathology, imaging, and specialist consultations.",
  },
  {
    id: "2",
    name: "Bangladesh Fertility Hospital",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/2/bvuo07yQ9ysBi6K1UCkseUpFFl41jPZcDEf0Lb5R/bangladesh-fertility-hospital.webp",
    href: "https://www.bdfertilityhospital.com/",
    category: "Hospitals",
    description: "Specialist fertility and reproductive health hospital providing IVF, gynaecology, and maternal care services.",
  },
  {
    id: "3",
    name: "FCH Limited",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/3/mPjR2FB0fzZsXIfyCbuEZDqjuFbfKYV7JjGWl8av/fch-limited.webp",
    href: "https://www.facebook.com/FCHLimited",
    category: "Hospitals",
    description: "Multi-specialty hospital network delivering comprehensive inpatient and outpatient healthcare across Bangladesh.",
  },
  {
    id: "4",
    name: "Aashoka Rescue",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/4/T6XxtuuqBtDcWZwp7L7dn13xZTwymKYWKHJXG5u8/aashoka-rescue.webp",
    href: "https://www.ashokarescue.com/",
    category: "Emergency",
    description: "Professional emergency ambulance and rescue service operating across Dhaka and surrounding districts.",
  },
  {
    id: "5",
    name: "Manipal Hospitals",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/5/YaNsHe1AVTM7sjsnxyZPhp6kOXKchz4rDtkhti9n/manipal-hospitals.webp",
    href: "https://www.manipalhospitalsglobal.com/",
    category: "Hospitals",
    description: "International hospital network providing advanced tertiary care, oncology, and cardiac surgery services.",
  },
  {
    id: "6",
    name: "Rushmono",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/6/HuPTqCFPYG1MOUK7ugimdI5nZBs6vunSYbtff/rushmono.webp",
    href: "http://rushmono.com/",
    category: "Technology",
    description: "Healthcare technology company specialising in hospital management systems and digital health infrastructure.",
  },
  {
    id: "7",
    name: "Unity Aid Hospital",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/7/D5DglADWdhCq1v7IZNxCtfg239SKVrMbcujxurVK/unity-aid-hospital.webp",
    category: "Hospitals",
    description: "Community hospital offering affordable inpatient care, surgical services, and outpatient consultations.",
  },
  {
    id: "8",
    name: "Physiozonebd",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/8/bROgFHfBpkRBx4rGuU3KrVR4ixRTra0mFHJdquor/physiozonebd.webp",
    href: "https://physiozonebd.com/",
    category: "Therapy",
    description: "Leading physiotherapy and rehabilitation centre in Bangladesh providing in-clinic and home-visit services.",
  },
  {
    id: "9",
    name: "Prince Court Hospital",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/9/mbvM6t02BNHRuLdpfr6hQxxXjlgRbTcFK9sX3kQ7/prince-court-hospital.webp",
    href: "https://princecourt.com/",
    category: "Hospitals",
    description: "Internationally accredited specialist hospital serving patients from Bangladesh and South-East Asia.",
  },
  {
    id: "10",
    name: "KPJ Healthcare",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/10/Pqf9nSHB6FpLYaSDnBCcimm6f5BYOkKyKje2Prwf/kpj-healthcare-berhad.webp",
    href: "https://www.kpjhealth.com.my/",
    category: "Hospitals",
    description: "Regional hospital group with expertise in oncology, cardiac care, and cross-border medical referrals.",
  },
  {
    id: "11",
    name: "Mahkota Medical Centre",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/11/c0e3ytZln2kQJd5qNHK89E6Q6nIwCJl9htWDb6ye/mahkota-medical-centre.webp",
    href: "https://www.mahkotamedical.com/",
    category: "Hospitals",
    description: "Specialist medical centre offering advanced diagnostics, cancer treatment, and cardiac procedures.",
  },
  {
    id: "12",
    name: "Apollo Clinic JMI",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUm8MAT0/our-partners/12/J9Db9Mhsaor3xkvLiObG9jWF1FrUAn8MqW1oz9ir/apollo-clinic-jmi-specialized-hospital.webp",
    href: "https://apolloclinicbd.com/",
    category: "Hospitals",
    description: "Apollo-affiliated specialized hospital in Bangladesh delivering world-class specialist care and diagnostics.",
  },
];
