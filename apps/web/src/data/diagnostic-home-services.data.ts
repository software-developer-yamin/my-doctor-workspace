export type TDiagnosticService = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isHomeSampleCollectionAvailable: boolean;
};

export const DIAGNOSTIC_SERVICES: TDiagnosticService[] = [
  {
    id: "1",
    slug: "anti-hav-igm",
    title: "Anti HAV - IgM",
    description: "Anti-HAV IgM is a blood test used to detect IgM antibodies against the Hepatitis A virus.",
    price: 975,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
  {
    id: "2",
    slug: "cbc",
    title: "CBC",
    description: "The CBC test (Complete Blood Count) is a routine blood test assessing red and white blood cells.",
    price: 400,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
  {
    id: "3",
    slug: "cbc-esr",
    title: "CBC, ESR",
    description: "CBC (Complete Blood Count) is a broad screening test that evaluates overall health and detects a variety of diseases.",
    price: 400,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
  {
    id: "4",
    slug: "lipid-profile",
    title: "Lipid Profile",
    description: "A lipid profile is a blood test that measures the levels of different fats (lipids) in your blood.",
    price: 850,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
  {
    id: "5",
    slug: "fasting-blood-sugar",
    title: "Fasting Blood Sugar (FBS)",
    description: "Measures blood glucose after you have not eaten for at least 8 hours. Used to diagnose diabetes.",
    price: 150,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
  {
    id: "6",
    slug: "hba1c",
    title: "HbA1c",
    description: "The HbA1c test measures the amount of blood sugar attached to hemoglobin and reveals average glucose.",
    price: 600,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
  {
    id: "7",
    slug: "serum-creatinine",
    title: "Serum Creatinine",
    description: "A serum creatinine test measures the level of creatinine in your blood and provides an estimate of kidney function.",
    price: 300,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
  {
    id: "8",
    slug: "thyroid-stimulating-hormone",
    title: "TSH (Thyroid Stimulating Hormone)",
    description: "TSH test is used to evaluate thyroid function and/or symptoms of a thyroid disorder.",
    price: 700,
    currency: "BDT",
    isHomeSampleCollectionAvailable: true,
  },
];
