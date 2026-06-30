"use client";

import { useState } from "react";
import { DoctorFAQ } from "@/types/doctor.type";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowUp01Icon,
    HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type DoctorFaqTabProps = {
    faqs: DoctorFAQ[];
    doctorName: string;
};

function FaqVoteButton({ faq }: { faq: DoctorFAQ }) {
    const [voted, setVoted] = useState(false);

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                setVoted(!voted);
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${voted
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
        >
            <HugeiconsIcon icon={ArrowUp01Icon} size={12} />
            {faq.votes + (voted ? 1 : 0)}
        </button>
    );
}

export function DoctorFaqTab({ faqs, doctorName }: DoctorFaqTabProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-foreground">
                        Frequently Asked Questions
                    </h3>
                    <p className="text-xs font-medium text-muted-foreground">
                        Common questions about {doctorName}&apos;s practice and appointments
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="h-10 w-fit gap-2 rounded-xl border-border px-5 text-xs font-medium hover:border-primary/40 hover:text-primary transition-all"
                >
                    <HugeiconsIcon icon={HelpCircleIcon} size={14} />
                    Ask a Question
                </Button>
            </div>

            {/* FAQ List */}
            <Accordion type="multiple" className="flex flex-col gap-3 border-none">
                {faqs.map((faq) => (
                    <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="rounded-[2rem] border border-border bg-card/50 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/[0.02] data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5 transition-all duration-300 overflow-hidden"
                    >
                        <AccordionTrigger className="px-6 py-5 md:px-8 md:py-6 hover:no-underline gap-4 [&>svg]:hidden">
                            <div className="flex items-start gap-4 text-left">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground transition-colors group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                                    <HugeiconsIcon icon={HelpCircleIcon} size={16} />
                                </div>
                                <span className="text-sm font-semibold text-foreground md:text-base">
                                    {faq.question}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                            <div className="ml-12">
                                <p className="text-sm font-medium leading-relaxed text-foreground/70">
                                    {faq.answer}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-4">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-lg bg-muted/30 px-2.5 py-1 text-micro font-medium text-muted-foreground">
                                            {faq.category}
                                        </span>
                                        <span className="text-micro font-medium text-muted-foreground">
                                            {new Date(faq.askedDate).toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <FaqVoteButton faq={faq} />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
