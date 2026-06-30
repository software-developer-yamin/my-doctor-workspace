import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HOME_FAQS = [
  {
    id: "h1",
    question: "How can I book an appointment?",
    answer: "Search for a doctor by name or specialty, select your preferred time slot, and confirm your booking through the app or website.",
  },
  {
    id: "h2",
    question: "Is online consultation available 24/7?",
    answer: "Yes, we have doctors available around the clock for online consultations. You can connect with a doctor any time, day or night.",
  },
  {
    id: "h3",
    question: "Can I get a prescription online?",
    answer: "Yes, our licensed doctors can provide digital prescriptions after your online consultation, which you can use at any pharmacy.",
  },
  {
    id: "h4",
    question: "Is my personal data secure?",
    answer: "Absolutely. We use industry-standard encryption and strict data protection guidelines to keep your personal and medical information safe.",
  },
  {
    id: "h5",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, mobile banking (bKash, Nagad, Rocket), and net banking for all our services.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export const FaqsSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-background py-8 md:py-16", className)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-12">
          {/* Left: Header + FAQ list */}
          <div className="flex-1">
            <SectionHeader
              label="Frequently Asked Questions"
              title="We're here to help you with all your questions."
              className="mb-8"
            />

            <div className="w-full space-y-3">
              {HOME_FAQS.map((faq) => (
                <details
                  key={faq.id}
                  className="group overflow-hidden rounded-md border border-border bg-background px-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-left text-sm font-bold text-foreground md:text-base [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="ml-2 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </summary>
                  <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Right: Support Card */}
          <div className="bg-primary/10 flex w-full flex-col overflow-hidden rounded-2xl md:w-72 md:shrink-0 lg:w-95">
            <div className="relative w-full aspect-4/3 overflow-hidden">
              <Image
                src="/images/faq-family.png"
                alt="Doctor with family"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-col items-center gap-4 px-6 py-8">
              <p className="text-foreground text-base font-semibold text-center">
                Still have questions?
              </p>
              <p className="text-muted-foreground text-sm text-center -mt-2">
                Our support team is ready to help you anytime.
              </p>
              <Button asChild className="w-full rounded-lg font-bold mt-1">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
