import { IconSvgElement } from "@hugeicons/react";

export type TFeelingType = "happy" | "normal" | "painful" | "extremely-painful";

export type TFeelingVitals = {
  pulse: string;
  bp: string;
  temp: string;
  weight: string;
  spo2: string;
  hba1c: string;
};

export type TFeelingRecord = {
  id: number;
  date: string;
  time: string;
  feeling: TFeelingType | string;
  vitals: TFeelingVitals;
  note: string;
};

export type TFeelingOption = {
  id: TFeelingType;
  label: string;
  icon: IconSvgElement;
  color: string;
  bg: string;
};
