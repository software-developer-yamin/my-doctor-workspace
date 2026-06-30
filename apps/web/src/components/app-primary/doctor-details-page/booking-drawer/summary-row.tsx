type SummaryRowProps = {
 label: string;
 value: string;
};

export function SummaryRow({ label, value }: SummaryRowProps) {
 return (
 <div className="flex items-center justify-between py-3.5">
 <span className="text-xs font-medium text-muted-foreground">
 {label}
 </span>
 <span className="text-sm font-semibold text-foreground text-right max-w-[60%] truncate">
 {value}
 </span>
 </div>
 );
}
