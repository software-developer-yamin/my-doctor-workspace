"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyAppointments, useUpdateAppointmentStatus } from "@/hooks/queries/use-doctor-dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DoctorAppointment, AppointmentStatus } from "@/types/doctor-dashboard.type";
import { useState } from "react";
import { format } from "date-fns";
import { CONSTANT } from "@/config/constant";
import { useRouter } from "next/navigation";
import { BookOpen01Icon, FileEditIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { appointmentStatus } from "@/lib/tokens";

export default function DoctorBookingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const params: Record<string, any> = { page, limit };
  if (statusFilter !== "all") params.status = statusFilter;

  const { data, isLoading, isError } = useMyAppointments(user?.id ?? "", params);
  const { mutate: updateStatus, isPending: isUpdating, variables: updatingVars } = useUpdateAppointmentStatus();

  const appointments: DoctorAppointment[] = data?.data ?? [];
  const meta = data?.meta;

  const filtered = search
    ? appointments.filter((a) =>
        a.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.hospital?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : appointments;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">All Bookings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Complete appointment history · {meta?.total ?? 0} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by patient or hospital..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card border-border h-16 animate-pulse rounded-xl border" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-destructive/10 border-destructive/20 rounded-xl border p-6 text-center">
          <p className="text-destructive text-sm font-medium">Failed to load bookings.</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="bg-muted/30 rounded-xl border border-dashed p-12 text-center">
          <HugeiconsIcon icon={BookOpen01Icon} className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <p className="text-muted-foreground font-medium">No bookings found</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="bg-card border-border rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Time</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Hospital</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Fee</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt, idx) => (
                  <tr key={appt._id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-foreground">{appt.customer?.name}</p>
                        <p className="text-xs text-muted-foreground">{appt.customer?.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {format(new Date(appt.appointmentDate), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {appt.selectedSchedule?.startTime}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{appt.hospital?.name}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <span>{appt.appointmentType}</span>
                      {appt.appointmentType === "Reference" && (appt as any).referralSource && (
                        <span className="block text-micro opacity-70">via {(appt as any).referralSource}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={appointmentStatus[appt.status].badge}>
                        {appt.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {CONSTANT.CURRENCY.SYMBOL}{appt.totalFee}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {appt.status === "Pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`h-8 text-xs gap-1.5 ${appointmentStatus.Pending.button}`}
                            disabled={isUpdating && updatingVars?.id === appt._id}
                            onClick={() => updateStatus({ id: appt._id, status: "In Progress" })}
                          >
                            {isUpdating && updatingVars?.id === appt._id ? "..." : "Start"}
                          </Button>
                        )}
                        {appt.status === "In Progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`h-8 text-xs gap-1.5 ${appointmentStatus.Completed.button}`}
                            disabled={isUpdating && updatingVars?.id === appt._id}
                            onClick={() => updateStatus({ id: appt._id, status: "Completed" })}
                          >
                            {isUpdating && updatingVars?.id === appt._id ? "..." : "Complete"}
                          </Button>
                        )}
                        {appt.status === "Completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1.5"
                            onClick={() => router.push(`/doctor/prescriptions/${appt._id}`)}
                          >
                            <HugeiconsIcon icon={FileEditIcon} className="h-3.5 w-3.5" />
                            Prescription
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
