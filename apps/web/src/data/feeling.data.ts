import {
  SmileIcon,
  NeutralIcon,
  Sad01Icon,
  SadDizzyIcon,
} from "@hugeicons/core-free-icons";
import { TFeelingRecord, TFeelingOption } from "@/types/feeling.type";

export const INITIAL_RECORDS: TFeelingRecord[] = [
  {
    id: 1,
    date: "08 April, 2026",
    time: "10:30 AM",
    feeling: "happy",
    vitals: {
      pulse: "72",
      bp: "120/80",
      temp: "98.6",
      weight: "70",
      spo2: "98",
      hba1c: "5.7",
    },
    note: "Feeling great after morning walk.",
  },
  {
    id: 2,
    date: "07 April, 2026",
    time: "04:15 PM",
    feeling: "normal",
    vitals: {
      pulse: "75",
      bp: "118/79",
      temp: "98.4",
      weight: "70",
      spo2: "99",
      hba1c: "5.7",
    },
    note: "Busy day at work, but okay.",
  },
];

export const FEELING_OPTIONS: TFeelingOption[] = [
  {
    id: "happy",
    label: "Happy",
    icon: SmileIcon,
    color: "#19B3BD",
    bg: "rgba(25, 179, 189, 0.1)",
  },
  {
    id: "normal",
    label: "Normal",
    icon: NeutralIcon,
    color: "#71BFFB",
    bg: "rgba(113, 191, 251, 0.1)",
  },
  {
    id: "painful",
    label: "Painful",
    icon: Sad01Icon,
    color: "#FFB504",
    bg: "rgba(255, 181, 4, 0.1)",
  },
  {
    id: "extremely-painful",
    label: "Extremely Painful",
    icon: SadDizzyIcon,
    color: "#F47721",
    bg: "rgba(244, 119, 33, 0.1)",
  },
];
