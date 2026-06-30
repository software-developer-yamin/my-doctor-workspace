import { PageHeader } from "@/components/common/page-header";
import { ContactSection } from "@/components/sections/contact-section";
import { CONTACT_PAGE_DATA } from "@/data/contact.data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Healthcare Support Bangladesh",
  description: "Contact My Doctor for appointments, support, and inquiries. Reach us by phone, WhatsApp, or email. We're available 24/7 for all your healthcare needs in Bangladesh.",
  keywords: ["contact My Doctor", "My Doctor support", "My Doctor phone number", "My Doctor customer service", "healthcare helpline Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/contact" },
  openGraph: {
    title: "Contact My Doctor | 24/7 Healthcare Support",
    description: "Get in touch with My Doctor for appointments, support, and inquiries — available 24/7 in Bangladesh.",
    url: "https://mydoctor.com.bd/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title={CONTACT_PAGE_DATA.header.title}
        description={CONTACT_PAGE_DATA.header.description}
        breadcrumb={[{ label: "Contact Us", active: true }]}
      />

      <ContactSection hideHeader={true} />
    </main>
  );
}
