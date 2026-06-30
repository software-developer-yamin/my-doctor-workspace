"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveQueueForDoctor } from "@/hooks/queries/use-queue";
import { Clock01Icon, UserGroupIcon, WorkflowSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TLiveQueue } from "@/types/queue.type";

const DEMO_QUEUE: TLiveQueue = {
    id: "demo",
    hospitalId: "demo",
    doctorId: "demo",
    date: new Date(),
    startTime: new Date(),
    totalSerial: 20,
    currentSerial: 7,
    avgWaitTimeInMin: 15,
    isActive: true,
    remainingPatients: 13,
};

interface LiveQueueCardProps {
    doctorId: string;
    mySerial?: number;
    hospitalId?: string;
    demo?: boolean;
    compact?: boolean;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function computeWaitString(mySerial: number, currentSerial: number, avgMin: number): string {
    const waitMinutes = (mySerial - currentSerial) * avgMin;
    if (waitMinutes <= 0) return "";
    if (waitMinutes > 60) {
        const hrs = Math.floor(waitMinutes / 60);
        const mins = waitMinutes % 60;
        return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    }
    return `${waitMinutes} min`;
}

export function LiveQueueCard({ doctorId, mySerial, hospitalId, demo, compact }: LiveQueueCardProps) {
    const { data: liveQueues = [], isLoading } = useLiveQueueForDoctor(demo ? "" : doctorId);
    const queues = demo ? [DEMO_QUEUE] : liveQueues;
    const activeQueue = hospitalId
        ? (queues.find((q) => q.hospitalId === hospitalId) ?? null)
        : (queues[0] ?? null);

    const waitString = (mySerial && activeQueue && mySerial > activeQueue.currentSerial)
        ? computeWaitString(mySerial, activeQueue.currentSerial, activeQueue.avgWaitTimeInMin)
        : "";

    /* ── Compact mode (inline bar for appointment cards) ── */
    if (compact) {
        if (isLoading) return null;

        if (!activeQueue) return (
            <div className="border-t border-border/40 px-4 pb-4 pt-3">
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-muted-foreground/30" />
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                        Live queue not started yet for today
                    </span>
                </div>
            </div>
        );

        return (
            <div className="border-t border-border/40 px-4 pb-4 pt-3">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-lg border border-border bg-muted/20 px-3 py-2">
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-xs font-semibold text-foreground">Live Queue</span>
                </div>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs font-medium text-muted-foreground">
                    Serving{" "}
                    <span className="font-semibold text-foreground">#{pad2(activeQueue.currentSerial)}</span>
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs font-medium text-muted-foreground">
                    {activeQueue.remainingPatients} remaining
                </span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs font-medium text-muted-foreground">
                    ~{activeQueue.avgWaitTimeInMin} min/patient
                </span>
                {mySerial && (
                    <>
                        <span className="text-muted-foreground/40">·</span>
                        {mySerial === activeQueue.currentSerial ? (
                            <span className="animate-pulse text-xs font-semibold text-primary">
                                Your turn now!
                            </span>
                        ) : mySerial > activeQueue.currentSerial ? (
                            <span className="text-xs font-medium text-muted-foreground">
                                Your serial:{" "}
                                <span className="font-semibold text-primary">#{pad2(mySerial)}</span>
                                {" · "}~{waitString} wait
                            </span>
                        ) : null}
                    </>
                )}
            </div>
            </div>
        );
    }

    /* ── Full mode ── */
    if (isLoading) {
        return (
            <div className="w-full rounded-xl border border-border bg-card p-5">
                <Skeleton className="mb-4 h-4 w-1/3" />
                <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    if (!activeQueue) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-4 py-8 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HugeiconsIcon icon={WorkflowSquare02Icon} size={20} />
                </div>
                <p className="text-sm font-semibold text-foreground">Queue Offline</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                    No active queue for today
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">Live Queue</h3>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-micro font-medium rounded-md px-2 py-0.5">
                    Live
                </Badge>
            </div>

            <div className="p-4">
                {/* Serial Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-primary/5 border border-primary/15 py-4 text-center">
                        <p className="mb-1 flex items-center gap-1 text-micro font-semibold text-muted-foreground uppercase tracking-wide">
                            <HugeiconsIcon icon={UserGroupIcon} size={12} className="text-primary" />
                            Serving
                        </p>
                        <span className="text-3xl font-bold text-primary tabular-nums">
                            {pad2(activeQueue.currentSerial)}
                        </span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg bg-muted/30 border border-border py-4 text-center">
                        <p className="mb-1 text-micro font-semibold text-muted-foreground uppercase tracking-wide">
                            Remaining
                        </p>
                        <span className="text-3xl font-bold text-foreground tabular-nums">
                            {activeQueue.remainingPatients}
                        </span>
                    </div>
                </div>

                {/* Avg wait info */}
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <HugeiconsIcon icon={Clock01Icon} size={12} />
                    <span>~{activeQueue.avgWaitTimeInMin} min per patient</span>
                </div>

                {/* My Serial */}
                {mySerial && (
                    <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3.5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-micro font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                    Your Serial
                                </p>
                                <span className="text-2xl font-bold text-primary tabular-nums">
                                    #{pad2(mySerial)}
                                </span>
                            </div>
                            <div className="text-right">
                                {mySerial === activeQueue.currentSerial ? (
                                    <span className="animate-pulse rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-micro font-semibold text-primary">
                                        Your turn!
                                    </span>
                                ) : mySerial > activeQueue.currentSerial ? (
                                    <div>
                                        <p className="text-micro font-semibold text-muted-foreground mb-0.5">Est. wait</p>
                                        <span className="text-sm font-bold text-foreground">~{waitString}</span>
                                    </div>
                                ) : (
                                    <span className="text-micro font-medium text-muted-foreground">Completed</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
