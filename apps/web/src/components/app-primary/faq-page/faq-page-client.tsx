"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS_DATA } from "@/data/faqs.data";
import { Search01Icon, CustomerService01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FaqPageClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof faq.answer === "string" &&
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="bg-background min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-secondary/10 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-black tracking-tight sm:text-6xl">
            How can we help?
          </h1>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg font-bold leading-relaxed italic">
            Search our frequently asked questions or browse the categories below. We're here to help you 24/7.
          </p>

          <div className="mx-auto max-w-3xl">
            <div className="group relative">
              <span className="text-muted-foreground absolute inset-y-0 left-0 flex items-center pl-6 group-focus-within:text-primary transition-colors">
                <HugeiconsIcon icon={Search01Icon} size={24} />
              </span>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 block h-16 w-full rounded-2xl border-2 border-transparent pr-8 pl-16 text-lg font-bold shadow-xl transition-all outline-none focus:ring-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto mt-16 px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar CTA */}
          <aside className="lg:w-1/3">
            <div className="bg-card border-border sticky top-24 rounded-2xl border p-8 shadow-sm">
              <div className="bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
                <HugeiconsIcon icon={CustomerService01Icon} size={32} />
              </div>
              <h3 className="text-foreground mb-3 text-2xl font-black">Still have questions?</h3>
              <p className="text-muted-foreground mb-8 text-sm font-bold leading-relaxed">
                Can't find the answer you're looking for? Please chat to our friendly team.
              </p>
              <Button asChild className="h-12 w-full rounded-md font-black shadow-lg shadow-primary/20 transition-all active:scale-95">
                <Link href="/#contact">Get in Touch</Link>
              </Button>
            </div>
          </aside>

          {/* Accordion List */}
          <div className="lg:w-2/3">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="bg-card border-border rounded-xl border px-6 transition-all data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
                  >
                    <AccordionTrigger className="text-foreground/90 py-6 text-left text-base font-black hover:no-underline md:text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 text-sm font-bold leading-relaxed md:text-base italic">
                      {faq.type === "text" ? (
                        <p>{faq.answer as string}</p>
                      ) : (
                        <ul className="list-disc space-y-2 pl-6">
                          {(faq.answer as string[]).map((item, idx) => (
                            <li key={idx} className="marker:text-primary">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="bg-muted/20 flex h-60 flex-col items-center justify-center rounded-2xl border-2 border-dashed">
                <p className="text-foreground text-xl font-black">No results found</p>
                <p className="text-muted-foreground mt-2 font-bold italic">Try a different search term or browse all questions.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
