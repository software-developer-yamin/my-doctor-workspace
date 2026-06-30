import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: unknown;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  className,
}: PageHeaderProps) => {
  return (
    <section
      className={cn(
        "bg-muted/50 border-border/50 border-b py-8 md:py-12 lg:py-16",
        className,
      )}
    >
      <div className="container flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-[2.75em]">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mx-auto text-sm leading-relaxed sm:text-base lg:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
