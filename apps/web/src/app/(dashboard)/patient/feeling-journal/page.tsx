"use client";

import { FeelingLogForm } from "@/components/app-patient/feeling-journal/feeling-log-form";
import { FeelingHistoryTable } from "@/components/app-patient/feeling-journal/feeling-history-table";
import { INITIAL_RECORDS } from "@/data/feeling.data";

export default function FeelingJournalPage() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-8 p-4 py-8 lg:p-10">
      <FeelingLogForm />
      <FeelingHistoryTable records={INITIAL_RECORDS} />
    </div>
  );
}
