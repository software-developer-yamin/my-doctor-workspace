"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar01Icon,
  Clock01Icon,
  DashboardSpeed01Icon,
  Home01Icon,
  MoreVerticalIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TRequest } from "@/types/request.type";

interface RequestCardProps {
  request: TRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "processing":
        return "bg-primary/10 text-primary";
      case "assigned":
        return "bg-secondary/10 text-secondary";
      case "completed":
        return "bg-success/10 text-success";
      case "cancelled":
        return "bg-error/10 text-error";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "home-service":
        return Home01Icon;
      case "lab-test":
        return DashboardSpeed01Icon;
      case "specialist-consultation":
        return UserGroupIcon;
      default:
        return Calendar01Icon;
    }
  };

  return (
    <Card className="shadow-xs group overflow-hidden border-none transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-5">
            <div className="bg-secondary/20 text-primary flex h-14 w-14 items-center justify-center rounded-md shadow-sm">
              <HugeiconsIcon icon={getCategoryIcon(request.category)} size={24} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge
                  className={`rounded-md border-none px-2 py-0.5 text-[9px] font-black tracking-widest uppercase italic shadow-none ${getStatusColor(
                    request.status,
                  )}`}
                >
                  {request.status}
                </Badge>
                <span className="text-muted-foreground text-micro font-bold uppercase tracking-wider">
                  #{request.id}
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                {request.title}
              </h3>
              <p className="text-muted-foreground text-xs font-bold italic opacity-60">
                {request.category.replace("-", " ").toUpperCase()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </Button>
        </div>

        <div className="border-border/5 mt-6 grid grid-cols-2 gap-4 border-t pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 flex h-9 w-9 items-center justify-center rounded-md">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size={16}
                className="text-primary/60"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-[9px] font-black tracking-widest uppercase">
                Requested
              </p>
              <p className="text-2xs font-black italic">
                {request.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 flex h-9 w-9 items-center justify-center rounded-md">
              <HugeiconsIcon
                icon={Clock01Icon}
                size={16}
                className="text-primary/60"
              />
            </div>
            <div>
              <p className="text-muted-foreground text-[9px] font-black tracking-widest uppercase">
                Arrival/Time
              </p>
              <p className="text-2xs font-black italic text-primary">
                {request.estimatedArrival || request.time}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="border-border/40 hover:bg-secondary/50 flex-1 rounded-md text-micro font-black tracking-widest uppercase italic transition-all"
          >
            Cancel Request
          </Button>
          <Button className="shadow-premium bg-primary hover:bg-primary-shade flex-1 rounded-md text-micro font-black tracking-widest uppercase transition-all">
            Track Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
