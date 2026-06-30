import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import Script from "next/script";
import Providers from "@/providers";
import { SITE } from "@/config/site";
import { ScrollRestoration } from "@/components/common/scroll-restoration";
import "./globals.css";
import "@aejkatappaja/phantom-ui/ssr.css";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "My Doctor",
  url: "https://mydoctor.com.bd",
  logo: "https://mydoctor.com.bd/logo.svg",
  description: SITE.description,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+8801974-200905",
    contactType: "customer service",
    availableLanguage: ["Bengali", "English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Ground floor, Khandakar General Hospital, Molla Tower, Bazirb Moor (Golap Chattar), Narsingdi",
    addressCountry: "BD",
  },
  sameAs: [
    "https://www.facebook.com/share/18TnLxUvHy/",
    "https://www.instagram.com/mydoctorinfo247?igsh=am9ncjJ2andiZnBp",
    "https://youtube.com/@mydoctorbd247?si=ES6XvYjy8irs-4lc",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "My Doctor",
  url: "https://mydoctor.com.bd",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://mydoctor.com.bd/doctors?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mydoctor.com.bd"),
  title: {
    default: SITE.name,
    template: `%s | My Doctor`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: SITE.name, url: SITE.url }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ScrollRestoration />
        <Providers>{children}</Providers>
        <Script
          src="https://rybbit.mydoctor.com.bd/api/script.js"
          data-site-id="fcd55f18a1d0"
          strategy="afterInteractive"
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}',{page_path:window.location.pathname});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
