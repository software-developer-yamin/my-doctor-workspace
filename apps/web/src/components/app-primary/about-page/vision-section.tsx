import { SectionHeader } from "@/components/common/section-header";
import { ABOUT_VISION_DATA } from "@/data/about.data";

export const VisionSection = () => {
  return (
    <section className="mx-auto max-w-6xl">
      <SectionHeader
        label={ABOUT_VISION_DATA.label}
        title={ABOUT_VISION_DATA.title}
        description={ABOUT_VISION_DATA.description}
        align="left"
        centeredOnMobile={true}
        className="mb-0"
      />
    </section>
  );
};
