"use client";

import { Button } from"@/components/ui/button";
import { SentIcon } from"@hugeicons/core-free-icons";
import { HugeiconsIcon } from"@hugeicons/react";

export const HospitalOpinionsTab = () => {
 return (
 <div className="text-muted-foreground border-border bg-card mt-6 rounded-md border p-12 text-center">
 <div className="mx-auto max-w-md">
 <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
 <HugeiconsIcon icon={SentIcon} size={32} />
 </div>
 <h3 className="text-foreground mb-2 text-lg font-medium">
 No Opinions Yet
 </h3>
 <p className="mb-6 text-sm leading-relaxed">
 There are no patient reviews or opinions available for this hospital
 at the moment. Be the first to share your experience.
 </p>
 <Button>Write a review</Button>
 </div>
 </div>
 );
};
