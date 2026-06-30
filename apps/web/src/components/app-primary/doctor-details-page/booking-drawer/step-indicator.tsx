"use client";

import { Fragment } from"react";
import { HugeiconsIcon } from"@hugeicons/react";
import { Tick01Icon } from"@hugeicons/core-free-icons";

type StepIndicatorProps = {
 current: number;
 labels: string[];
};

export function StepIndicator({ current, labels }: StepIndicatorProps) {
 return (
 <div className="flex items-center w-full px-2">
 {labels.map((label, idx) => {
 const stepNum = idx + 1;
 const isActive = stepNum === current;
 const isCompleted = stepNum < current;
 return (
 <Fragment key={stepNum}>
 {idx > 0 && (
 <div
 className={`h-px flex-1 transition-colors duration-500 ${
 isCompleted ?"bg-primary/50" :"bg-border"
 }`}
 />
 )}
 <div className="flex flex-col items-center gap-1.5">
 <div
 className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
 isActive
 ?"bg-primary text-primary-foreground scale-110 ring-4 ring-primary/15 shadow-lg shadow-primary/20"
 : isCompleted
 ?"bg-primary/15 text-primary"
 :"bg-muted text-muted-foreground"
 }`}
 >
 {isCompleted ? (
 <HugeiconsIcon icon={Tick01Icon} size={14} strokeWidth={3} />
 ) : (
 stepNum
 )}
 </div>
 <span
 className={`text-micro font-medium whitespace-nowrap transition-colors ${
 isActive ?"text-primary" :"text-muted-foreground"
 }`}
 >
 {label}
 </span>
 </div>
 </Fragment>
 );
 })}
 </div>
 );
}
