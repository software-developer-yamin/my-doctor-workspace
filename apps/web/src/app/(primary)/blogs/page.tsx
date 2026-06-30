import { PageHeader } from "@/components/common/page-header";
import { SectionHeader } from "@/components/common/section-header";
import { Metadata } from "next";
import { BlogNewsTabs } from "./_components/blog-news-tabs";

export const metadata: Metadata = {
  title: "Healthcare News, Events & Offers Bangladesh",
  description: "Stay up to date with the latest healthcare news, medical events, and exclusive offers from My Doctor Bangladesh. Health tips, hospital updates, and wellness content.",
  keywords: ["My Doctor news", "healthcare events Bangladesh", "medical offers", "health updates Bangladesh", "healthcare blog Bangladesh", "medical news Dhaka"],
  alternates: { canonical: "https://mydoctor.com.bd/blogs" },
  openGraph: {
    title: "News, Events & Offers | My Doctor Bangladesh",
    description: "Latest healthcare news, events, and exclusive offers from My Doctor Bangladesh.",
    url: "https://mydoctor.com.bd/blogs",
  },
};

export default function BlogsPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="News, Events & Offers"
        description="Stay informed with the latest medical news, upcoming events, and special offers."
      />

      <section className="container py-10 md:py-16">
        <SectionHeader
          label="News & Offers"
          title="Recent Updates"
          description="Browse all events, news, and offers from My Doctor."
        />
        <BlogNewsTabs />
      </section>
    </main>
  );
}
