export type TDiagnosticProvider = {
  id: string;
  name: string;
  address: string;
  image: string;
  branchesCount: number;
};

export type TDiagnosticTest = {
  id: string;
  name: string;
  description: string;
  providers: TDiagnosticProvider[];
  startingPrice: number;
};

export const MOCK_DIAGNOSTIC_PROVIDERS: TDiagnosticProvider[] = [
  {
    id: "popular-diagnostic-dhanmondi",
    name: "Popular Diagnostic Centre Ltd. | Dhanmondi",
    address: "House #16, Road # 2, Dhanmondi R/A, 6, Dhanmondi, Dhaka-1205, Bangladesh",
    image: "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfUGcMBQk9/hospitals/40/KeNDkeSxw2dtfAvVoVkkCI9deiJxMmb27Jd2a3Hh/popular-diagnostic-centre-ltd-dhanmondi.webp",
    branchesCount: 11
  },
  {
    id: "ibn-sina-dhanmondi",
    name: "Ibn Sina Diagnostic & Imaging Center | Dhanmondi",
    address: "House # 48, Road # 9/A, Dhanmondi, Dhaka 1209",
    image: "https://img.sasthyaseba.com/LBUDK0RCAzICFSpfUGcMBQk9/hospitals/27/1wPIakUzDtnZAimj435lrcAXrifN0FgpZSf3hJ6O/ibn-sina-diagnostic-imaging-center-dhanmondi.webp",
    branchesCount: 5
  }
];

export const DIAGNOSTIC_TESTS_DATA: TDiagnosticTest[] = [
  {
    id: "1-hour-postprandial-plasma-glucose",
    name: "1 hour postprandial Plasma glucose",
    description: "The 1-hour postprandial plasma glucose (PPG) test measures blood sugar levels one hour after eating.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 200,
  },
  {
    id: "1-5-hrs-postprandial-plasma-glucose",
    name: "1.5 hrs postprandial Plasma glucose",
    description: "The 1.5-hour postprandial plasma glucose (PPG) measurement evaluates blood sugar levels 90 minutes after eating.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 200,
  },
  {
    id: "17a-oh-progesterone",
    name: "17a - OH Progesterone",
    description: "17α-Hydroxyprogesterone (17a-OH Progesterone) is a blood test used to measure the levels of this hormone.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 2200,
  },
  {
    id: "2-hrs-postprandial-plasma-glucose",
    name: "2 hrs postprandial Plasma glucose",
    description: "2 Hours Postprandial Plasma Glucose is a blood test used to measure the level of glucose in blood.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 200,
  },
  {
    id: "24-hrs-ambulatory-bp",
    name: "24 Hrs Ambulatory BP",
    description: "A 24-hour ambulatory blood pressure (BP) monitoring test involves wearing a small, portable device.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 2500,
  },
  {
    id: "24-hrs-urinary-metanephrine",
    name: "24 hrs Urinary Metanephrine",
    description: "24-Hour Urinary Metanephrine is a test that measures the levels of metanephrines (byproducts of adrenaline and noradrenaline) in urine over a 24-hour period. It is primarily used to diagnose pheochromocytoma, a rare tumor of the adrenal glands that causes excessive production of adrenaline.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 4000,
  },
  {
    id: "24-hrs-urinary-microalbumin",
    name: "24 hrs Urinary Microalbumin",
    description: "24-Hour Urinary Microalbumin is a test that measures the amount of microalbumin (a small protein) excreted in urine.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 1200,
  },
  {
    id: "24-hrs-urinary-chloride",
    name: "24 hrs. Urinary Chloride (Cl)",
    description: "24-Hour Urinary Chloride (Cl) is a test that measures the amount of chloride excreted in the urine.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 300,
  },
  {
    id: "24-hrs-urinary-cortisol",
    name: "24 Hrs. Urinary Cortisol",
    description: "24-Hour Urinary Cortisol is a test used to measure the level of cortisol in the urine.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 1000,
  },
  {
    id: "24-hrs-urinary-creatinine",
    name: "24 hrs. Urinary Creatinine",
    description: "24-Hour Urinary Creatinine is a test that measures the amount of creatinine excreted in the urine.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 500,
  },
  {
    id: "24-hrs-urinary-potassium",
    name: "24 hrs. Urinary Potassium (K)",
    description: "24-Hour Urinary Potassium (K) is a test that measures the amount of potassium excreted in the urine.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 300,
  },
  {
    id: "24-hrs-urinary-sodium",
    name: "24 hrs. Urinary Sodium (Na)",
    description: "24-Hour Urinary Sodium (Na) is a test that measures the amount of sodium excreted in the urine.",
    providers: MOCK_DIAGNOSTIC_PROVIDERS,
    startingPrice: 300,
  }
];
