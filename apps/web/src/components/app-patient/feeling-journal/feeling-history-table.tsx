"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar01Icon,
  Download01Icon,
  FilterIcon,
  Note01Icon,
  SmileIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FEELING_OPTIONS } from "@/data/feeling.data";
import { TFeelingRecord } from "@/types/feeling.type";

interface FeelingHistoryTableProps {
  records: TFeelingRecord[];
}

export function FeelingHistoryTable({ records }: FeelingHistoryTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <h4 className="text-xl font-black text-foreground">
            Your feeling records
          </h4>
          <Badge
            variant="secondary"
            className="bg-primary/5 text-primary rounded-md px-2.5 py-1 font-bold"
          >
            {records.length} Records
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-border/40 h-11 gap-3 rounded-md px-6 text-2xs font-bold tracking-tight shadow-sm transition-all hover:bg-secondary/50 active:scale-95"
              >
                <HugeiconsIcon
                  icon={FilterIcon}
                  size={16}
                  className="text-primary"
                />
                Feeling Type
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  className="opacity-40"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-md p-2">
              <DropdownMenuItem
                asChild
                className="focus:bg-primary/5 focus:text-primary rounded-md py-3 font-bold"
              >
                <div className="flex w-full items-center">All Feelings</div>
              </DropdownMenuItem>
              {FEELING_OPTIONS.map((f) => (
                <DropdownMenuItem
                  key={f.id}
                  asChild
                  className="focus:bg-primary/5 focus:text-primary rounded-md py-3 font-bold"
                >
                  <div className="flex w-full items-center">
                    <div
                      className="mr-3 h-2 w-2 rounded-full"
                      style={{ backgroundColor: f.color }}
                    />
                    {f.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="border-border/40 text-muted-foreground h-11 gap-3 rounded-md px-6 text-2xs font-bold shadow-sm transition-all hover:text-foreground"
          >
            <HugeiconsIcon icon={Calendar01Icon} size={16} />
            12/10/2021 - 12/11/2022
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="border-border/40 h-11 w-11 rounded-md shadow-sm transition-all active:scale-90"
          >
            <HugeiconsIcon icon={Download01Icon} size={18} />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent border-border/10">
                <TableHead className="w-[180px] px-8 py-5 text-micro font-black tracking-widest uppercase">
                  Date & Time
                </TableHead>
                <TableHead className="px-8 py-5 text-micro font-black tracking-widest uppercase">
                  Feeling
                </TableHead>
                <TableHead className="px-8 py-5 text-micro font-black tracking-widest uppercase">
                  Vitals Summary
                </TableHead>
                <TableHead className="px-8 py-5 text-micro font-black tracking-widest uppercase">
                  Notes
                </TableHead>
                <TableHead className="w-[80px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => {
                const feelingData = FEELING_OPTIONS.find(
                  (f) => f.label.toLowerCase() === record.feeling.toLowerCase()
                );
                return (
                  <TableRow
                    key={record.id}
                    className="group border-border/5 hover:bg-secondary/10 transition-colors"
                  >
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black">{record.date}</span>
                        <span className="text-muted-foreground text-2xs font-bold">
                          {record.time}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge
                        variant="outline"
                        className="gap-2 rounded-md border-transparent px-4 py-2 font-black transition-transform"
                        style={{
                          backgroundColor: feelingData?.bg,
                          color: feelingData?.color,
                        }}
                      >
                        <HugeiconsIcon
                          icon={feelingData?.icon || SmileIcon}
                          size={14}
                        />
                        {feelingData?.label || record.feeling}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-tighter">
                            Pulse
                          </span>
                          <span className="text-xs font-black">
                            {record.vitals.pulse}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-tighter">
                            BP
                          </span>
                          <span className="text-xs font-black">
                            {record.vitals.bp}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-tighter">
                            Temp
                          </span>
                          <span className="text-xs font-black">
                            {record.vitals.temp}°F
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] px-8 py-6">
                      <p className="text-muted-foreground truncate text-xs font-bold italic">
                        "{record.note}"
                      </p>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full opacity-0 transition-opacity group-hover:opacity-100 italic"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {records.length === 0 && (
            <div className="text-muted-foreground/40 flex h-40 flex-col items-center justify-center gap-4 italic font-bold">
              <HugeiconsIcon
                icon={Note01Icon}
                size={48}
                className="opacity-20"
              />
              <p className="tracking-tight">
                No feeling records found for the selected period.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
