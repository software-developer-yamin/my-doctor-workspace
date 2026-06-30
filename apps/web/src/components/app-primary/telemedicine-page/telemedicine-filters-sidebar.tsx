import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const TelemedicineFiltersSidebar = () => {
  return (
    <div className="bg-white dark:bg-card rounded-md border border-border p-5 shadow-sm h-fit">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-lg font-bold text-foreground">Filters</h3>
        <button className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          Clear
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4"]} className="w-full">
        {/* Consultation Fee */}
        <AccordionItem value="item-1" className="border-border">
          <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 capitalize">
            Consultation Fee
          </AccordionTrigger>
          <AccordionContent className="pb-8 overflow-visible">
            <div className="px-1 pt-2">
              <Slider
                defaultValue={[0, 8000]}
                max={8000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between mt-4 relative h-10">
                 <div className="bg-[#078FF7] text-white text-micro font-bold px-2 py-1.5 rounded-full absolute -top-1 left-0 flex flex-col items-center">
                    <span>৳ 0</span>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-[#078FF7] rotate-180 -mb-2 mt-0.5" />
                 </div>
                 <div className="bg-[#078FF7] text-white text-micro font-bold px-2 py-1.5 rounded-full absolute -top-1 right-0 flex flex-col items-center">
                    <span>৳ 8000</span>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-[#078FF7] rotate-180 -mb-2 mt-0.5" />
                 </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="item-2" className="border-border">
          <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 capitalize">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue="all" className="flex flex-col gap-4">
              {[
                { label: "All", value: "all" },
                { label: "Online Now", value: "online" },
                { label: "Available in next 2 hours", value: "next-2h" },
                { label: "Available Today", value: "today" },
                { label: "Female doctors only", value: "female" },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.value} id={item.value} className="border-primary text-primary" />
                  <Label htmlFor={item.value} className="text-sm font-medium text-foreground cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="item-3" className="border-border">
          <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 capitalize">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <HugeiconsIcon
                  key={star}
                  icon={StarIcon}
                  size={32}
                  className="text-muted-foreground/30 hover:text-yellow-500 cursor-pointer transition-colors"
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sort By */}
        <AccordionItem value="item-4" className="border-border">
          <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline py-5 capitalize">
            Sort By
          </AccordionTrigger>
          <AccordionContent>
             <RadioGroup defaultValue="relevance" className="flex flex-col gap-4">
              {[
                { label: "Relevance", value: "relevance" },
                { label: "Popularity", value: "popularity" },
                { label: "Fees: low to high", value: "fees-asc" },
                { label: "Fees: high to low", value: "fees-desc" },
                { label: "Rating", value: "rating" },
                { label: "Experience", value: "experience" },
                { label: "Ranking", value: "ranking" },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.value} id={`sort-${item.value}`} className="border-primary text-primary" />
                  <Label htmlFor={`sort-${item.value}`} className="text-sm font-medium text-foreground cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
