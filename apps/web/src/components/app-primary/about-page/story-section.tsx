import { SectionHeader } from "@/components/common/section-header";
import { ABOUT_STORY_DATA } from "@/data/about.data";
import Image from "next/image";

export const StorySection = () => {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className="space-y-6">
        <SectionHeader
          label={ABOUT_STORY_DATA.label}
          title={ABOUT_STORY_DATA.title}
          className="sm:items-start sm:justify-start"
        />
        <div className="space-y-4">
          {ABOUT_STORY_DATA.description.map((para, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "text-muted-foreground text-lg leading-relaxed"
                  : "text-muted-foreground text-base leading-relaxed"
              }
            >
              {para}
            </p>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <Image
          src={ABOUT_STORY_DATA.image}
          alt="My Doctor Healthcare Team"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500"
        />
      </div>
    </section>
  );
};
