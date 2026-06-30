"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PARTNER_CATEGORIES,
  PARTNERS_PAGE_DATA,
  TPartnerCategory,
} from "@/data/partners-page.data";
import Image from "next/image";
import Link from "next/link";

function PartnerCard({
  partner,
}: {
  partner: (typeof PARTNERS_PAGE_DATA)[number];
}) {
  return (
    <Card className="border-border/60 hover:border-primary/30 hover:shadow-md flex flex-col transition-all duration-200">
      {/* Logo area */}
      <div className="bg-muted/30 flex h-24 items-center justify-center rounded-t-xl border-b border-border/40 p-3 sm:h-28 sm:p-4">
        <Image
          src={partner.image}
          alt={partner.name}
          width={120}
          height={72}
          className="h-auto max-h-14 w-auto max-w-full object-contain sm:max-h-16"
          unoptimized
        />
      </div>

      <CardContent className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1.5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          <h3 className="text-foreground text-xs font-semibold leading-snug sm:text-sm">
            {partner.name}
          </h3>
          <Badge variant="outline" className="w-max shrink-0 text-xs">
            {partner.category}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-3 flex-1 text-xs leading-relaxed line-clamp-3">
          {partner.description}
        </p>
        {partner.href && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 w-full rounded-lg text-xs font-medium"
          >
            <Link href={partner.href} target="_blank" rel="noopener noreferrer">
              Visit Website
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function PartnersTabs() {
  return (
    <Tabs defaultValue="All">
      <TabsList className="mb-6 h-auto flex-wrap gap-1 bg-muted/60 p-1">
        {PARTNER_CATEGORIES.map((cat: TPartnerCategory) => (
          <TabsTrigger key={cat} value={cat} className="text-xs font-medium">
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>

      {PARTNER_CATEGORIES.map((cat: TPartnerCategory) => {
        const partners =
          cat === "All"
            ? PARTNERS_PAGE_DATA
            : PARTNERS_PAGE_DATA.filter((p) => p.category === cat);

        return (
          <TabsContent key={cat} value={cat}>
            {partners.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12 text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  No partners in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {partners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
