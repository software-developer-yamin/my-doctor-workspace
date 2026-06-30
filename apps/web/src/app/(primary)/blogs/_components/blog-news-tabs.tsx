"use client";

import { NewsGridCard } from "@/components/cards/news-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NEWS_DATA } from "@/data/news.data";

export function BlogNewsTabs() {
  const allItems = Object.values(NEWS_DATA).flat();

  return (
    <Tabs defaultValue="All" className="w-full">
      <TabsList variant="line" className="mb-8 shadow-none">
        <TabsTrigger
          value="All"
          className="data-active:text-primary! data-active:after:bg-primary! h-auto overflow-visible px-4 py-2.5 text-sm font-semibold transition-all"
        >
          All
        </TabsTrigger>
        {Object.keys(NEWS_DATA).map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="data-active:text-primary! data-active:after:bg-primary! h-auto overflow-visible px-4 py-2.5 text-sm font-semibold transition-all"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="All" className="focus:outline-none">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {allItems.map((item) => (
            <NewsGridCard key={item.id} item={item} />
          ))}
        </div>
      </TabsContent>

      {Object.entries(NEWS_DATA).map(([category, items]) => (
        <TabsContent key={category} value={category} className="focus:outline-none">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <NewsGridCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
