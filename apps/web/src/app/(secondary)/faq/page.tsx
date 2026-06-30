import type { Metadata } from "next";
import { FaqPageClient } from "@/components/app-primary/faq-page/faq-page-client";
import { FAQS_DATA } from "@/data/faqs.data";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about My Doctor — doctor appointments, telemedicine, ambulance services, diagnostic tests, and more healthcare services in Bangladesh.",
  alternates: {
    canonical: "https://mydoctor.com.bd/faq",
  },
  openGraph: {
    title: "FAQ | My Doctor",
    description:
      "Answers to your questions about booking doctors, telemedicine, ambulance, and diagnostic services via My Doctor Bangladesh.",
    url: "https://mydoctor.com.bd/faq",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS_DATA.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: Array.isArray(faq.answer)
        ? faq.answer.join(" ")
        : faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqPageClient />
    </>
  );
}
