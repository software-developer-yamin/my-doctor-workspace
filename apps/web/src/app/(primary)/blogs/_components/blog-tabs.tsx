"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  TBlogArticle,
  TBlogCategory,
} from "@/data/blog.data";
import { Clock01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

function ArticleCard({ article }: { article: TBlogArticle }) {
  return (
    <Card className="border-border/60 hover:border-primary/30 hover:shadow-md flex flex-col overflow-hidden transition-all duration-200">
      {/* Colour thumbnail */}
      <div className="bg-primary/5 flex h-36 items-center justify-center border-b border-border/40 sm:h-40">
        <Badge variant="secondary" className="text-xs font-semibold">
          {article.category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:gap-3">
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={UserIcon} size={12} className="text-primary shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">{article.author.name}</span>
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={12} className="text-primary shrink-0" />
            {article.readTime} min
          </span>
        </div>

        <h3 className="text-foreground mb-2 text-sm font-semibold leading-snug">
          {article.title}
        </h3>
        <p className="text-muted-foreground mb-4 flex-1 text-xs leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs">
            {new Date(article.publishedAt).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Button
            asChild
            variant="link"
            size="sm"
            className="h-auto shrink-0 p-0 text-xs font-semibold text-primary"
          >
            <Link href={`/blogs/${article.slug}`}>Read More →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function BlogTabs() {
  return (
    <Tabs defaultValue="All">
      <TabsList className="mb-6 h-auto flex-wrap gap-1 bg-muted/60 p-1">
        {BLOG_CATEGORIES.map((cat: TBlogCategory) => (
          <TabsTrigger key={cat} value={cat} className="text-xs font-medium">
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>

      {BLOG_CATEGORIES.map((cat: TBlogCategory) => {
        const articles =
          cat === "All"
            ? BLOG_ARTICLES
            : BLOG_ARTICLES.filter((a) => a.category === cat);

        return (
          <TabsContent key={cat} value={cat}>
            {articles.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12 text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  No articles in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
