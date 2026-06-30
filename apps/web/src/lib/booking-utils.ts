import { format, addMinutes, parse } from "date-fns";

export const parseTime = (timeStr: string): Date | null => {
  if (!timeStr) return null;
  const formats = ["hh:mm a", "h:mm a", "HH:mm", "H:mm", "hh:mm", "h:mm"];
  for (const fmt of formats) {
    try {
      const parsed = parse(timeStr, fmt, new Date());
      if (!isNaN(parsed.getTime())) return parsed;
    } catch {}
  }
  return null;
};

export const generateSlots = (startTime: string, endTime: string): string[] => {
  const slots: string[] = [];
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime()))
    return slots;
  let current = start;
  while (current < end) {
    const slotEnd = addMinutes(current, 30);
    if (slotEnd <= end) {
      slots.push(`${format(current, "h:mm")}–${format(slotEnd, "h:mm a")}`);
    }
    current = slotEnd;
  }
  return slots;
};

export const getNextDays = (n: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};
