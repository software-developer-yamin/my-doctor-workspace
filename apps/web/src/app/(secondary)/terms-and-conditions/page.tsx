import { PageHeader } from "@/components/common/page-header";
import { SITE } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read My Doctor's terms and conditions governing use of our healthcare platform, booking services, telemedicine, and all related services in Bangladesh.",
  alternates: { canonical: "https://mydoctor.com.bd/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Terms & Conditions"
        description="Please read these terms and conditions carefully before using our services."
        breadcrumb={[{ label: "Terms & Conditions", active: true }]}
      />

      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="space-y-12">
          <section>
            <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
              1. Agreement to Terms
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              By registering for or using the My Doctor platform, you agree to comply with and be bound by these Terms and Conditions. These terms govern your access to doctor consultations, ambulance services, diagnostic bookings, and other healthcare-related features provided by My Doctor Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
              2. Eligibility & Account Security
            </h2>
            <p className="text-muted-foreground mb-4 text-base leading-relaxed">
              To use our services, you must be at least 18 years old or have parental consent. You are responsible for:
            </p>
            <ul className="text-muted-foreground list-disc space-y-3 pl-6 text-base">
              <li>Providing accurate personal and contact information during sign-up.</li>
              <li>Keeping your account credentials confidential and not sharing them with others.</li>
              <li>Maintaining an updated list of your chronic conditions or allergies if shared with providers.</li>
            </ul>
          </section>

          <section className="bg-destructive/5 border-destructive/20 rounded-2xl border p-8">
            <h2 className="text-destructive mb-4 text-xl font-bold tracking-tight">
              3. Critical Medical Disclaimer
            </h2>
            <p className="text-destructive/80 text-base leading-relaxed">
              My Doctor is a technology platform that facilitates connections between patients and healthcare providers. <strong>Important:</strong> We do not provide direct medical diagnosis or treatment. All consultations are performed by independent BMDC-verified doctors. In the event of a life-threatening emergency, do not wait for a consultation; instead, contact emergency services or proceed to the nearest hospital immediately.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
              4. Ambulance Service Terms
            </h2>
            <p className="text-muted-foreground mb-4 text-base leading-relaxed">
              When booking an ambulance through our platform:
            </p>
            <ul className="text-muted-foreground list-disc space-y-3 pl-6 text-base">
              <li>The estimated time of arrival (ETA) provided is based on traffic and weather conditions and is not a firm guarantee.</li>
              <li>We act as a dispatching intermediary; the actual transport service and in-ambulance care are the responsibility of the third-party provider.</li>
              <li>Users must provide an accurate pickup location and reachable contact number.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
              5. Diagnostic Bookings & Reports
            </h2>
            <p className="text-muted-foreground mb-4 text-base leading-relaxed">
              For lab tests and home sample collections:
            </p>
            <ul className="text-muted-foreground list-disc space-y-3 pl-6 text-base">
              <li>Patients must follow pre-test requirements (e.g., fasting) as specified by the laboratory.</li>
              <li>My Doctor is not liable for errors in results provided by partner diagnostic centers.</li>
              <li>Digital reports provided on the dashboard are for informational purposes and should be verified with a printed copy for legal matters.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
              6. Fees & Cancellation Policy
            </h2>
            <p className="text-muted-foreground mb-4 text-base leading-relaxed">
              Our payment and refund policies are as follows:
            </p>
            <ul className="text-muted-foreground list-disc space-y-3 pl-6 text-base">
              <li><strong>Doctor Appointments:</strong> Cancellations made at least 12 hours before the time are eligible for a full refund.</li>
              <li><strong>Convenience Fees:</strong> My Doctor may charge a non-refundable service fee for maintaining the digital infrastructure.</li>
              <li><strong>Refunds:</strong> Processed refunds may take 5-10 working days depending on the bank and payment gateway used.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight">
              7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              To the fullest extent permitted by law, My Doctor Ltd shall not be liable for any direct, indirect, or consequential damages resulting from the use of the platform or the medical services provided by independent practitioners and third-party transport/laboratory providers.
            </p>
          </section>

          <section className="bg-muted/30 rounded-2xl p-8">
            <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight">
              Legal Inquiries
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              If you have any questions or legal concerns regarding these terms, please contact our legal department:
              <br />
              <br />
              <strong>Email:</strong> {SITE.contact.email}
              <br />
              <strong>Hotline:</strong> {SITE.contact.phones[0]}
              <br />
              <strong>Address:</strong> {SITE.contact.address}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
