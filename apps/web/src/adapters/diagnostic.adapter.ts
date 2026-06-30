import {
  BackendDiagnosticTest,
  BackendLab,
  BackendLabTestEntry,
  DiagnosticTest,
  Lab,
  LabTestEntry,
} from "@/types/diagnostic.type";

export const diagnosticTestAdapter = (raw: BackendDiagnosticTest): DiagnosticTest => ({
  id: raw._id,
  name: raw.name,
  description: raw.description,
  priceStartFrom: raw.minLabPrice ?? raw.price_start_from,
  image: raw.image,
  category: raw.category,
  isHomeSampleCollectionAvailable: raw.isHomeSampleCollectionAvailable ?? false,
  minLabPrice: raw.minLabPrice,
  labsCount: raw.labsCount ?? 0,
});

export const diagnosticTestsAdapter = (raws: BackendDiagnosticTest[]): DiagnosticTest[] =>
  raws.map(diagnosticTestAdapter);

export const labTestEntryAdapter = (raw: BackendLabTestEntry): LabTestEntry => ({
  id: raw._id,
  testId: raw.test?._id ?? "",
  name: raw.test?.name ?? "",
  description: raw.test?.description ?? "",
  price: raw.price,
});

export const labAdapter = (raw: BackendLab): Lab => {
  const bdLocationObj = typeof raw.bdLocation === "object" && raw.bdLocation ? raw.bdLocation : null;

  return {
    id: raw._id,
    name: raw.name,
    description: raw.description ?? "",
    hotline: raw.hotline,
    email: raw.email ?? "",
    website: raw.website ?? "",
    logo: raw.logo ?? "",
    coverPhoto: raw.cover_photo ?? "",
    address: raw.address,
    about: raw.about ?? "",
    bdLocation: bdLocationObj ?? undefined,
    upazila: raw.upazila,
    type: raw.type ?? "Diagnostic Lab",
    rating: Number(raw.rating) || 0,
    totalReviews: Number(raw.totalReviews) || 0,
    isOpen24_7: !!raw.isOpen24_7,
    tests: (raw.tests || []).map(labTestEntryAdapter),
    testsCount: raw.testsCount ?? raw.tests?.length ?? 0,
  };
};

export const labsAdapter = (raws: BackendLab[]): Lab[] =>
  raws.map(labAdapter);
