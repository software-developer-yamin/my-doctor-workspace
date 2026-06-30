import { NewsGridCard } from "@/components/cards/news-card";
import { SectionHeader } from "@/components/common/section-header";
import { NEWS_DATA } from "@/data/news.data";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const NewsSection = ({ className }: { className?: string }) => {
  const allItems = Object.values(NEWS_DATA).flat();

  return (
    <section className={cn("bg-surface py-12 lg:py-16", className)}>
      <div className="container">
        <SectionHeader
          label="News & Offers"
          title="Recent Updates"
          description="Stay informed with the latest medical news and special offers."
        >
          <Link
            href="/blogs"
            className="text-primary hover:bg-primary/5 group flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/40 px-4 py-2 text-sm font-bold transition-all hover:border-primary"
          >
            <span>View All</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </SectionHeader>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {allItems.map((item) => (
            <NewsGridCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
