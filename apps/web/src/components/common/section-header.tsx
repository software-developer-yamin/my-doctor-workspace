import { cn } from "@/lib/utils";
import React from "react";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  centeredOnMobile?: boolean;
  titleAs?: "h1" | "h2" | "h3";
}

export const SectionHeader = ({
  label,
  title,
  description,
  children,
  className,
  align = "left",
  centeredOnMobile,
  titleAs: Tag = "h2",
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-[2.5em] flex flex-row items-center justify-between gap-[1em] sm:items-end lg:mb-[3em]",
        align === "center" &&
          "flex-col items-center text-center sm:items-center",
        centeredOnMobile &&
          "flex-col items-center text-center sm:flex-row sm:items-end sm:text-left",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          align === "center" && "mx-auto",
          centeredOnMobile && "mx-auto sm:mx-0",
        )}
      >
        {label && (
          <div
            className={cn(
              "mb-[0.5em] hidden items-center sm:flex",
              align === "center" && "justify-center",
              centeredOnMobile && "justify-center sm:justify-start",
            )}
          >
            <span className="border-primary text-primary border-l-[0.125em] pl-[0.5em] text-[0.75em] font-bold tracking-wider uppercase">
              {label}
            </span>
          </div>
        )}
        <Tag className="text-foreground text-lg font-bold tracking-tight sm:text-[1.875em] sm:leading-tight lg:text-[2em]">
          {title}
        </Tag>
        {description && (
          <p className="text-muted-foreground hidden text-[1em] leading-relaxed font-medium sm:block lg:text-[1.125em]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};
