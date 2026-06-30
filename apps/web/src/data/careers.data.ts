export type TJobDepartment = "Medical" | "Engineering" | "Operations" | "Support";
export type TJobType = "Full-time" | "Part-time" | "Contract";

export type TJob = {
  id: string;
  title: string;
  department: TJobDepartment;
  type: TJobType;
  location: string;
  experience: string;
  description: string;
  postedAt: string;
  deadline: string;
};

export type TCareersBenefit = {
  title: string;
  description: string;
};

export type THiringStep = {
  value: string;
  title: string;
  description: string;
};

export const CAREERS_STATS = {
  employees: 120,
  cities: 8,
  openRoles: 24,
};

export const CAREERS_BENEFITS: TCareersBenefit[] = [
  {
    title: "Health Insurance",
    description: "Comprehensive medical coverage for you and your immediate family, including specialist consultations.",
  },
  {
    title: "Career Growth",
    description: "Structured learning paths, mentorship programs, and funded professional certifications.",
  },
  {
    title: "Flexible Hours",
    description: "Hybrid and remote-friendly schedules designed around patient care and team collaboration.",
  },
  {
    title: "Competitive Pay",
    description: "Market-leading salaries with performance bonuses and annual increments tied to impact.",
  },
  {
    title: "Paid Leave",
    description: "Generous annual leave, sick leave, and special leave for healthcare emergencies.",
  },
  {
    title: "Team Culture",
    description: "A collaborative, mission-driven workplace with regular team events and open leadership.",
  },
];

export const CAREERS_HIRING_STEPS: THiringStep[] = [
  {
    value: "apply",
    title: "Apply Online",
    description: "Submit your CV and a short cover letter through our careers portal or email.",
  },
  {
    value: "screen",
    title: "Initial Screen",
    description: "Our HR team reviews your application and schedules a 20-minute introductory call.",
  },
  {
    value: "interview",
    title: "Panel Interview",
    description: "Meet the hiring team for a technical or role-specific discussion and Q&A session.",
  },
  {
    value: "offer",
    title: "Offer & Onboarding",
    description: "Receive your offer letter and complete onboarding with your new team.",
  },
];

export const CAREERS_JOBS: TJob[] = [
  {
    id: "j1",
    title: "Cardiologist",
    department: "Medical",
    type: "Full-time",
    location: "Dhaka",
    experience: "5+ years",
    description:
      "Lead cardiac care consultations and virtual heart health assessments for patients across Bangladesh. Collaborate with multidisciplinary teams on complex cases.",
    postedAt: "2026-06-01",
    deadline: "2026-07-31",
  },
  {
    id: "j2",
    title: "Registered Nurse",
    department: "Medical",
    type: "Full-time",
    location: "Narsingdi",
    experience: "2+ years",
    description:
      "Provide professional bedside nursing care, assist with telemedicine triage, and support the clinical documentation process for our partner hospitals.",
    postedAt: "2026-06-05",
    deadline: "2026-07-25",
  },
  {
    id: "j3",
    title: "Radiologist",
    department: "Medical",
    type: "Full-time",
    location: "Dhaka",
    experience: "4+ years",
    description:
      "Interpret diagnostic imaging results including X-ray, CT, and MRI for partner clinics and provide timely reports to attending physicians.",
    postedAt: "2026-06-08",
    deadline: "2026-08-05",
  },
  {
    id: "j4",
    title: "Medical Laboratory Scientist",
    department: "Medical",
    type: "Full-time",
    location: "Chittagong",
    experience: "3+ years",
    description:
      "Perform and validate diagnostic laboratory tests, maintain instrument quality control, and ensure accurate sample processing at partner diagnostic centres.",
    postedAt: "2026-06-10",
    deadline: "2026-07-30",
  },
  {
    id: "j5",
    title: "Clinical Operations Manager",
    department: "Operations",
    type: "Full-time",
    location: "Dhaka",
    experience: "5+ years",
    description:
      "Oversee end-to-end clinical workflows, coordinate between doctors, hospitals, and patients, and drive quality improvement initiatives across all service lines.",
    postedAt: "2026-06-02",
    deadline: "2026-07-20",
  },
  {
    id: "j6",
    title: "Healthcare Administrator",
    department: "Operations",
    type: "Full-time",
    location: "Dhaka",
    experience: "3+ years",
    description:
      "Manage appointment scheduling, patient records, insurance verification, and daily operational reporting across our network of partner facilities.",
    postedAt: "2026-06-04",
    deadline: "2026-07-28",
  },
  {
    id: "j7",
    title: "Frontend Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Dhaka (Remote OK)",
    experience: "3+ years",
    description:
      "Build and maintain patient-facing features in React and Next.js, focusing on accessibility, performance, and a seamless healthcare experience for Bangladeshi users.",
    postedAt: "2026-06-03",
    deadline: "2026-08-10",
  },
  {
    id: "j8",
    title: "Backend Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Dhaka (Remote OK)",
    experience: "3+ years",
    description:
      "Design and scale Node.js APIs, integrate third-party healthcare data systems, and ensure HIPAA-aligned data security across our backend infrastructure.",
    postedAt: "2026-06-06",
    deadline: "2026-08-10",
  },
  {
    id: "j9",
    title: "Mobile Engineer (React Native)",
    department: "Engineering",
    type: "Full-time",
    location: "Dhaka (Remote OK)",
    experience: "2+ years",
    description:
      "Develop and ship the My Doctor patient mobile app, delivering features like appointment booking, live queue tracking, and health records on iOS and Android.",
    postedAt: "2026-06-12",
    deadline: "2026-08-15",
  },
  {
    id: "j10",
    title: "Patient Support Specialist",
    department: "Support",
    type: "Full-time",
    location: "Dhaka",
    experience: "1+ year",
    description:
      "Handle inbound patient queries via call, WhatsApp, and chat — resolving appointment issues, billing questions, and escalating clinical concerns to the right team.",
    postedAt: "2026-06-07",
    deadline: "2026-07-22",
  },
  {
    id: "j11",
    title: "Doctor Onboarding Specialist",
    department: "Support",
    type: "Full-time",
    location: "Dhaka",
    experience: "1+ year",
    description:
      "Guide newly registered physicians through profile setup, verification, and platform training to ensure a smooth onboarding experience on My Doctor.",
    postedAt: "2026-06-09",
    deadline: "2026-07-26",
  },
  {
    id: "j12",
    title: "Data Analyst",
    department: "Operations",
    type: "Full-time",
    location: "Dhaka",
    experience: "2+ years",
    description:
      "Analyse appointment trends, patient outcomes, and operational KPIs to surface insights that improve service quality and guide strategic decisions.",
    postedAt: "2026-06-11",
    deadline: "2026-08-01",
  },
];
