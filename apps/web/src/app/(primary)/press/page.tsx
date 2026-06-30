import { PageHeader } from "@/components/common/page-header";
import { SectionHeader } from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PRESS_MEDIA_CONTACT,
  PRESS_NEWS_ITEMS,
  PRESS_RELEASES,
} from "@/data/press.data";
import {
  ArrowRight01Icon,
  Call02Icon,
  Calendar01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press & Media Bangladesh",
  description: "Press releases, media kit, and news coverage about My Doctor — Bangladesh's leading digital healthcare platform. For media inquiries contact our press team.",
  keywords: ["My Doctor press", "My Doctor media kit", "healthcare startup Bangladesh", "digital health news", "My Doctor press release"],
  alternates: { canonical: "https://mydoctor.com.bd/press" },
  openGraph: {
    title: "Press & Media | My Doctor Bangladesh",
    description: "Press releases and media resources from My Doctor — Bangladesh's leading digital healthcare platform.",
    url: "https://mydoctor.com.bd/press",
  },
};

export default function PressPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Press & Media"
        description="News, announcements, and media resources from My Doctor."
      />

      <div className="container space-y-10 py-8 md:space-y-16 md:py-20">
        {/* Media Contact */}
        <section>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <p className="text-primary mb-1 text-xs font-semibold uppercase tracking-wider">
                    Media Contact
                  </p>
                  <h2 className="text-foreground mb-1 text-base font-bold sm:text-lg">
                    {PRESS_MEDIA_CONTACT.name}
                  </h2>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {PRESS_MEDIA_CONTACT.title}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                    <a
                      href={`mailto:${PRESS_MEDIA_CONTACT.email}`}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:underline break-all"
                    >
                      <HugeiconsIcon icon={Mail01Icon} size={15} className="shrink-0" />
                      {PRESS_MEDIA_CONTACT.email}
                    </a>
                    <a
                      href={`tel:${PRESS_MEDIA_CONTACT.phone}`}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <HugeiconsIcon icon={Call02Icon} size={15} className="shrink-0" />
                      {PRESS_MEDIA_CONTACT.phone}
                    </a>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="h-9 w-full shrink-0 rounded-xl px-6 text-sm font-semibold sm:w-auto"
                >
                  <Link href="/contact">Request Media Kit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Press Releases */}
        <section>
          <SectionHeader
            label="Announcements"
            title="Press Releases"
            description="Official announcements from My Doctor."
          />
          <div className="space-y-4">
            {PRESS_RELEASES.map((release) => (
              <Card
                key={release.id}
                className="border-border/60 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Calendar01Icon} size={12} className="text-primary shrink-0" />
                      {new Date(release.date).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    {release.relatedHospital && (
                      <Badge variant="secondary" className="text-xs">
                        {release.relatedHospital}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-foreground mb-2 text-sm font-semibold leading-snug sm:text-base">
                    {release.headline}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {release.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* In the News */}
        <section>
          <SectionHeader
            label="Media Coverage"
            title="My Doctor in the News"
            description="Selected coverage from leading publications."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRESS_NEWS_ITEMS.map((item) => (
              <Card
                key={item.id}
                className="border-border/60 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {item.source}
                    </Badge>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {new Date(item.date).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-foreground text-sm font-semibold leading-snug">
                    {item.headline}
                  </p>
                  <Link
                    href={item.url}
                    className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
                    target={item.url !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    Read Article
                    <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
