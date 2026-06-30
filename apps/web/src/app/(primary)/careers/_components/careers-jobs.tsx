"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CAREERS_JOBS, TJob, TJobDepartment } from "@/data/careers.data";
import {
  Briefcase01Icon,
  Calendar01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const DEPARTMENTS: Array<TJobDepartment | "All"> = [
  "All",
  "Medical",
  "Engineering",
  "Operations",
  "Support",
];

function JobCard({ job }: { job: TJob }) {
  return (
    <Card className="border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-start gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {job.department}
          </Badge>
          <Badge variant="outline" className="text-xs font-medium">
            {job.type}
          </Badge>
        </div>

        <h3 className="text-foreground mb-2 text-sm font-semibold leading-snug sm:text-base">
          {job.title}
        </h3>
        <p className="text-muted-foreground mb-4 text-xs leading-relaxed sm:text-sm">
          {job.description}
        </p>

        <div className="mb-4 flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Location01Icon} size={13} className="text-primary shrink-0" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Briefcase01Icon} size={13} className="text-primary shrink-0" />
            {job.experience}
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Calendar01Icon} size={13} className="text-primary shrink-0" />
            Deadline:{" "}
            {new Date(job.deadline).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <Button
          asChild
          size="sm"
          className="h-8 w-full rounded-lg px-4 text-xs font-semibold sm:w-auto"
        >
          <Link href="/contact">Apply Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function CareersJobs() {
  return (
    <Tabs defaultValue="All">
      <TabsList className="mb-6 h-auto flex-wrap gap-1 bg-muted/60 p-1">
        {DEPARTMENTS.map((dept) => (
          <TabsTrigger key={dept} value={dept} className="text-xs font-medium">
            {dept}
          </TabsTrigger>
        ))}
      </TabsList>

      {DEPARTMENTS.map((dept) => {
        const jobs =
          dept === "All"
            ? CAREERS_JOBS
            : CAREERS_JOBS.filter((j) => j.department === dept);

        return (
          <TabsContent key={dept} value={dept}>
            {jobs.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12 text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  No open roles in this department right now.
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Check back soon or{" "}
                  <Link
                    href="/contact"
                    className="text-primary underline underline-offset-2"
                  >
                    send us your CV
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
