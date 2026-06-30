import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type NewsItem = {
  id: string | number;
  title: string;
  image: string;
  publishedAt: string;
  href: string;
  badge?: string;
};

export const NewsFeaturedCard = ({ item, className }: { item: NewsItem; className?: string }) => {
  return (
    <Link
      href={item.href}
      className={cn("group flex flex-col", className)}
    >
      <div className="bg-muted/20 relative mb-[1.5em] aspect-video w-full overflow-hidden rounded-[0.75em]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500"
        />
        {item.badge && (
          <div className="bg-primary absolute top-4 left-4 rounded-lg px-3 py-1 text-[0.75em] font-bold text-white shadow-lg">
            {item.badge}
          </div>
        )}
      </div>
      <h6 className="text-foreground group-hover:text-primary text-[1.25em] leading-tight font-bold transition-colors lg:text-[1.5em]">
        {item.title}
      </h6>
      <p className="text-muted-foreground mt-[0.5em] text-[0.875em] font-medium">
        Published at: {item.publishedAt}
      </p>
    </Link>
  );
};

export const NewsGridCard = ({ item, className }: { item: NewsItem; className?: string }) => {
  return (
    <Link
      href={item.href}
      className={cn("group flex flex-col rounded-md border border-border bg-background p-3 transition-shadow hover:shadow-md", className)}
    >
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500"
        />
        {item.badge && (
          <div className="bg-primary absolute top-2 left-2 rounded-md px-2 py-0.5 text-xs font-bold text-white shadow">
            {item.badge}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <h6 className="text-foreground line-clamp-3 text-sm font-bold leading-snug">
          {item.title}
        </h6>
        <span className="text-primary mt-auto flex items-center gap-1 text-sm font-bold">
          Read Post <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export const NewsRowCard = ({ item, className }: { item: NewsItem; className?: string }) => {
  return (
    <Link
      href={item.href}
      className={cn("group flex flex-col gap-[1em] sm:flex-row sm:items-center", className)}
    >
      <div className="bg-muted/20 relative aspect-video w-full shrink-0 overflow-hidden rounded-[0.75em] sm:w-[8em] lg:w-[10em]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500"
        />
        {item.badge && (
          <div className="bg-primary absolute top-2 left-2 rounded-md px-2 py-0.5 text-[0.625em] font-bold text-white shadow-md sm:hidden lg:block">
            {item.badge}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h6 className="text-foreground group-hover:text-primary line-clamp-2 text-[1em] font-bold transition-colors lg:text-[1.125em]">
          {item.title}
        </h6>
        <p className="text-muted-foreground mt-[0.25em] text-[0.75em] font-medium">
          Published at: {item.publishedAt}
        </p>
      </div>
    </Link>
  );
};
