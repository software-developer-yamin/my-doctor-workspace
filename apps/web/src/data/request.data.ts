import { TRequest } from "@/types/request.type";

export const REQUESTS_DATA: TRequest[] = [
  {
    id: "REQ-3001",
    title: "Nursing Care (Post-Surgery)",
    category: "home-service",
    date: "08 April, 2026",
    time: "09:00 AM",
    status: "processing",
    estimatedArrival: "11:30 AM",
  },
  {
    id: "REQ-3002",
    title: "Full Body Health Checkup",
    category: "lab-test",
    date: "09 April, 2026",
    time: "08:00 AM",
    status: "pending",
  },
  {
    id: "REQ-2995",
    title: "Dermatology Consultation",
    category: "specialist-consultation",
    date: "05 April, 2026",
    time: "10:00 AM",
    status: "completed",
  },
];
