import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllNewsSlugs, getNewsItemBySlug } from "@/data/news.data";
import { ArrowLeft02Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItemBySlug(slug);
  if (!item) return { title: "Not Found" };

  const description = item.content[0]?.slice(0, 160) ?? `${item.title} — My Doctor Bangladesh`;

  return {
    title: item.title,
    description,
    alternates: { canonical: `https://mydoctor.com.bd/blogs/${slug}` },
    openGraph: {
      title: item.title,
      description,
      url: `https://mydoctor.com.bd/blogs/${slug}`,
      type: "article",
      images: item.image ? [{ url: `https://mydoctor.com.bd${item.image}`, alt: item.title }] : [],
      publishedTime: item.publishedAt,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsItemBySlug(slug);

  if (!item) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    image: item.image ? `https://mydoctor.com.bd${item.image}` : undefined,
    datePublished: item.publishedAt,
    url: `https://mydoctor.com.bd/blogs/${slug}`,
    articleSection: item.category,
    author: item.author
      ? { "@type": "Person", name: item.author.name, ...(item.author.credentials ? { description: item.author.credentials } : {}) }
      : { "@type": "Organization", name: "My Doctor" },
    publisher: {
      "@type": "Organization",
      name: "My Doctor",
      url: "https://mydoctor.com.bd",
      logo: { "@type": "ImageObject", url: "https://mydoctor.com.bd/og-image.jpg" },
    },
    description: item.content[0]?.slice(0, 160),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="bg-background min-h-screen">
      {/* Hero image */}
      <div className="relative h-56 w-full overflow-hidden sm:h-72 md:h-96 lg:h-[28rem]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back button overlay */}
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-xl border-white/30 bg-white/10 px-3 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            <Link href="/blogs">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
              Back
            </Link>
          </Button>
        </div>

        {/* Badge overlay */}
        {item.badge && (
          <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6">
            <Badge className="bg-primary text-white text-xs font-bold px-3 py-1">
              {item.badge}
            </Badge>
          </div>
        )}
      </div>

      {/* Article body */}
      <div className="container max-w-3xl py-8 md:py-12">
        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="text-xs font-semibold">
            {item.category}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Calendar01Icon} size={13} className="text-primary shrink-0" />
            {item.publishedAt}
          </span>
          {item.author && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-muted-foreground/50">·</span>
              <span>{item.author.name}</span>
              {item.author.credentials && (
                <span className="text-muted-foreground/70">, {item.author.credentials}</span>
              )}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-foreground mb-6 text-2xl font-bold leading-snug tracking-tight sm:text-3xl md:text-4xl">
          {item.title}
        </h1>

        <hr className="mb-8 border-border/50" />

        {/* Content paragraphs */}
        <div className="space-y-5">
          {item.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-foreground/80 text-sm leading-[1.85] sm:text-base"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-sm font-medium">
            <Link href="/blogs">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={15} />
              Back to News & Updates
            </Link>
          </Button>
        </div>
      </div>
      </main>
    </>
  );
}
