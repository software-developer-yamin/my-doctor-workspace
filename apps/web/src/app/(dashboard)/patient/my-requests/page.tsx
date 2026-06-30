"use client";

import { RequestCard } from "@/components/app-patient/requests-page/request-card";
import { REQUESTS_DATA } from "@/data/request.data";
import { Button } from "@/components/ui/button";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function MyRequestsPage() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-10 p-4 py-10 lg:p-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            My Service Requests
          </h1>
          <p className="text-muted-foreground text-sm font-bold">
            Track and manage your requests for home care, lab tests, and more.
          </p>
        </div>
        <Button className="shadow-primary bg-primary hover:bg-primary-shade h-12 gap-3 rounded-md px-8 text-xs font-black tracking-widest uppercase">
          <HugeiconsIcon icon={Add01Icon} size={20} />
          New Request
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {REQUESTS_DATA.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>

      {REQUESTS_DATA.length === 0 && (
        <div className="flex h-80 flex-col items-center justify-center gap-5 italic text-center">
          <p className="text-muted-foreground text-lg font-bold opacity-40">
            No active or past requests found.
          </p>
          <Button variant="link" className="text-primary font-bold decoration-2">
            Make a new request
          </Button>
        </div>
      )}
    </div>
  );
}
