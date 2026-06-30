import { ServiceDeactivated } from "@/components/common/service-deactivated";
import { getPageFeature } from "@/config/features";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Under Development",
  description: "This service is currently being integrated with our backend systems.",
};

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = await searchParams;
  const fromPath = params.from || "";
  const feature = getPageFeature(fromPath);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center">
      <ServiceDeactivated
        serviceName={feature?.name}
        description={feature?.description}
        launchDate={feature?.launchDate}
      />
    </main>
  );
}
