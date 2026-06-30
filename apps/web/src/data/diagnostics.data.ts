export type TDiagnosticCategory = {
  id: string;
  name: string;
  image: string;
  href: string;
};

export const DIAGNOSTIC_CATEGORIES: TDiagnosticCategory[] = [
  {
    id: "ct-scan",
    name: "CT Scan",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUGMMAT0/CTScan/1/cvxaVWF4rDr8mLnAJMKbPEFdW85lBt5Icujrw8Fl.webp",
    href: "/diagnostics?category=CT-Scan",
  },
  {
    id: "blood-tests",
    name: "Blood Tests",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUGMMAT0/Blood+Tests/2/NyIRqNpK5YQbVw0ICZg8v3bUsMpDKbvSB9yXRuJz.webp",
    href: "/diagnostics?category=Blood-Tests",
  },
  {
    id: "endoscopy",
    name: "Endoscopy",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUGMMAT0/Endoscopy/3/vMFHUbrEbNbj5H8Ge3UVjEK8OsYZdiiFxbvUxF3k.webp",
    href: "/diagnostics?category=Endoscopy",
  },
  {
    id: "ultrasound",
    name: "Ultrasound",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUGMMAT0/Ultrasound/4/02Nw2gRWPhv9EZoCVDLJTUptk6Ssn8uTI0f7iAYn.webp",
    href: "/diagnostics?category=Ultrasound",
  },
  {
    id: "x-ray",
    name: "X-Ray",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUGMMAT0/X-Ray/2/DTqbYVsk9Kf5Uza76XHxEm8IGyselYBjPLKukGT5.webp",
    href: "/diagnostics?category=X-Ray",
  },
  {
    id: "microbiology",
    name: "Microbiology",
    image: "https://img.sasthyaseba.com/NgsDK0RCAzICDXxUUGMMAT0/Microbiology/1/QQwhsTHQxv8IYLavfnpqFEr6WadckUy0eAVD9AgM.webp",
    href: "/diagnostics?category=Microbiology",
  },
];
