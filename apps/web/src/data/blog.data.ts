export type TBlogCategory =
  | "All"
  | "Cardiology"
  | "General Health"
  | "Nutrition"
  | "Mental Health"
  | "News";

export type TBlogAuthor = {
  name: string;
  role: string;
};

export type TBlogArticle = {
  id: string;
  slug: string;
  title: string;
  category: Exclude<TBlogCategory, "All">;
  author: TBlogAuthor;
  reviewedBy?: string;
  publishedAt: string;
  readTime: number;
  summary: string;
  thumbnail: string;
  tags: string[];
  featured?: boolean;
};

export const BLOG_CATEGORIES: TBlogCategory[] = [
  "All",
  "Cardiology",
  "General Health",
  "Nutrition",
  "Mental Health",
  "News",
];

export const BLOG_ARTICLES: TBlogArticle[] = [
  {
    id: "b1",
    slug: "heart-disease-prevention-bangladesh",
    title: "Heart Disease in Bangladesh: Risk Factors, Prevention, and Early Detection",
    category: "Cardiology",
    author: { name: "Dr. Farid Hossain", role: "Cardiologist, NICVD Dhaka" },
    reviewedBy: "Dr. Shahana Begum, MD",
    publishedAt: "2026-06-10",
    readTime: 8,
    summary:
      "Cardiovascular disease is the leading cause of death in Bangladesh. Learn the key risk factors specific to the Bangladeshi population and practical steps to protect your heart.",
    thumbnail: "/images/hero/01.svg",
    tags: ["Heart Health", "Prevention", "Bangladesh"],
    featured: true,
  },
  {
    id: "b2",
    slug: "diabetes-management-bangla-diet",
    title: "Managing Type 2 Diabetes with a Traditional Bangladeshi Diet",
    category: "Nutrition",
    author: { name: "Nusrat Jahan, RD", role: "Registered Dietitian" },
    reviewedBy: "Dr. Khalid Rahman, MD",
    publishedAt: "2026-06-08",
    readTime: 6,
    summary:
      "Rice, hilsa, and lentils don't have to be off the menu. Discover how to adapt traditional Bangladeshi meals for stable blood glucose and long-term diabetes management.",
    thumbnail: "/images/hero/02.svg",
    tags: ["Diabetes", "Diet", "Nutrition"],
  },
  {
    id: "b3",
    slug: "dengue-fever-prevention-2026",
    title: "Dengue Fever Season 2026: Symptoms, Treatment, and How to Stay Safe",
    category: "General Health",
    author: { name: "Dr. Ruma Akter", role: "Internal Medicine, Dhaka Medical College" },
    publishedAt: "2026-06-05",
    readTime: 5,
    summary:
      "With dengue cases rising in Dhaka and Chittagong, understanding the warning signs and knowing when to seek hospital care can save lives.",
    thumbnail: "/images/hero/03.svg",
    tags: ["Dengue", "Infection", "Emergency"],
  },
  {
    id: "b4",
    slug: "mental-health-stigma-bangladesh",
    title: "Breaking the Silence: Mental Health Awareness in Bangladesh",
    category: "Mental Health",
    author: { name: "Dr. Mahbub Alam", role: "Psychiatrist, NIMH Dhaka" },
    reviewedBy: "Dr. Parvin Sultana, PhD",
    publishedAt: "2026-06-02",
    readTime: 7,
    summary:
      "Mental illness affects one in four Bangladeshis, yet fewer than 10% seek care. We explore the cultural barriers and how to access support without stigma.",
    thumbnail: "/images/hero/04.svg",
    tags: ["Mental Health", "Stigma", "Awareness"],
  },
  {
    id: "b5",
    slug: "child-vaccination-schedule-bangladesh",
    title: "The Complete Child Vaccination Schedule for Bangladeshi Parents",
    category: "General Health",
    author: { name: "Dr. Sadia Islam", role: "Paediatrician, Shishu Hospital" },
    publishedAt: "2026-05-28",
    readTime: 5,
    summary:
      "From birth to age five, here is a complete guide to the EPI schedule, optional vaccines, and how to track your child's immunisation records digitally.",
    thumbnail: "/images/hero/05.svg",
    tags: ["Vaccination", "Children", "Paediatrics"],
  },
  {
    id: "b6",
    slug: "high-blood-pressure-lifestyle-tips",
    title: "7 Lifestyle Changes That Actually Lower Blood Pressure",
    category: "Cardiology",
    author: { name: "Dr. Tanvir Ahmed", role: "Cardiologist, Square Hospital" },
    reviewedBy: "Dr. Farhan Kabir, MD",
    publishedAt: "2026-05-24",
    readTime: 6,
    summary:
      "Hypertension affects 25% of adults in Bangladesh. These evidence-based lifestyle adjustments can meaningfully reduce your readings without medication alone.",
    thumbnail: "/images/hero/01.svg",
    tags: ["Hypertension", "Lifestyle", "Heart Health"],
  },
  {
    id: "b7",
    slug: "kidney-disease-early-signs",
    title: "Silent Threat: Early Warning Signs of Chronic Kidney Disease",
    category: "General Health",
    author: { name: "Dr. Nasreen Begum", role: "Nephrologist, BSMMU" },
    publishedAt: "2026-05-20",
    readTime: 6,
    summary:
      "Chronic kidney disease often shows no symptoms until advanced stages. Discover which warning signs to watch for and when to get a creatinine test.",
    thumbnail: "/images/hero/02.svg",
    tags: ["Kidney", "Chronic Disease", "Diagnosis"],
  },
  {
    id: "b8",
    slug: "anxiety-management-techniques",
    title: "5 Clinically Proven Techniques to Manage Daily Anxiety",
    category: "Mental Health",
    author: { name: "Fatema Khatun, MCP", role: "Clinical Psychologist" },
    reviewedBy: "Dr. Rezwanul Islam, MD",
    publishedAt: "2026-05-15",
    readTime: 4,
    summary:
      "From diaphragmatic breathing to CBT journaling — these practical techniques are recommended by Bangladesh mental health professionals for everyday anxiety relief.",
    thumbnail: "/images/hero/03.svg",
    tags: ["Anxiety", "Mental Health", "Therapy"],
  },
  {
    id: "b9",
    slug: "mydoctor-telemedicine-launch",
    title: "My Doctor Expands Telemedicine to 8 New Districts Across Bangladesh",
    category: "News",
    author: { name: "My Doctor Editorial Team", role: "" },
    publishedAt: "2026-06-15",
    readTime: 3,
    summary:
      "Starting July 2026, patients in Sylhet, Rajshahi, Barishal, and five other districts can connect with certified physicians via video and phone consultation.",
    thumbnail: "/images/hero/04.svg",
    tags: ["My Doctor", "Expansion", "Telemedicine"],
  },
  {
    id: "b10",
    slug: "nutrition-iron-deficiency-women-bangladesh",
    title: "Iron Deficiency Anaemia in Women: Causes, Symptoms, and Food Solutions",
    category: "Nutrition",
    author: { name: "Anika Rashid, RD", role: "Senior Nutritionist, Dhaka" },
    reviewedBy: "Dr. Shirin Akter, Gynaecologist",
    publishedAt: "2026-05-10",
    readTime: 5,
    summary:
      "Anaemia affects nearly 40% of women in Bangladesh. Find out which locally available foods can restore iron levels naturally alongside medical treatment.",
    thumbnail: "/images/hero/05.svg",
    tags: ["Nutrition", "Women's Health", "Anaemia"],
  },
  {
    id: "b11",
    slug: "cancer-screening-bangladesh",
    title: "Cancer Screening in Bangladesh: What Tests You Should Get and When",
    category: "General Health",
    author: { name: "Dr. Mostafa Kamal", role: "Oncologist, NICRH" },
    publishedAt: "2026-05-05",
    readTime: 7,
    summary:
      "Early cancer detection saves lives. This guide covers the recommended screening tests for breast, cervical, colorectal, and oral cancer available in Bangladesh.",
    thumbnail: "/images/hero/01.svg",
    tags: ["Cancer", "Screening", "Prevention"],
  },
  {
    id: "b12",
    slug: "postpartum-depression-guide",
    title: "Postpartum Depression: What New Mothers in Bangladesh Need to Know",
    category: "Mental Health",
    author: { name: "Dr. Rumana Islam", role: "Psychiatrist & Gynaecologist" },
    publishedAt: "2026-04-28",
    readTime: 6,
    summary:
      "Postpartum depression is real, common, and treatable. We cut through the myths, describe the symptoms, and explain where Bangladeshi mothers can get confidential help.",
    thumbnail: "/images/hero/02.svg",
    tags: ["Postpartum", "Mental Health", "Mothers"],
  },
];
