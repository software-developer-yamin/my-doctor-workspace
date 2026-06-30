export type TRequestStatus = "pending" | "processing" | "assigned" | "completed" | "cancelled";

export type TRequestCategory = "home-service" | "lab-test" | "specialist-consultation" | "medicine";

export type TRequest = {
  id: string;
  title: string;
  category: TRequestCategory;
  date: string;
  time: string;
  status: TRequestStatus;
  estimatedArrival?: string;
};
