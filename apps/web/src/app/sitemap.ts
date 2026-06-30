import type { MetadataRoute } from "next";
import { ENV } from "@/config/env";
import { NURSE_DETAILS_DATA } from "@/data/nurse-details.data";
import { TELEMEDICINE_SPECIALIZATIONS } from "@/data/telemedicine.data";
import { getAllNewsSlugs } from "@/data/news.data";

const BASE_URL = "https://mydoctor.com.bd";
const API_URL = ENV.NEXT_PUBLIC_API_URL;

async function fetchSlugs<T extends { slug?: string }>(
  endpoint: string
): Promise<string[]> {
  try {
    const res = await fetch(
      `${API_URL}${endpoint}?limit=1000&fields=slug`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const items: T[] = json?.data ?? [];
    return items.map((i) => i.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctorSlugs, hospitalSlugs] = await Promise.all([
    fetchSlugs("/doctors/public"),
    fetchSlugs("/hospitals/public"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/doctors`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/hospitals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/telemedicine`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/diagnostics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ambulances`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/specializations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/nurses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/domiciliary-services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/health-checkup-services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/partners`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/press`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/offers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/pharmacy`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const nurseRoutes: MetadataRoute.Sitemap = NURSE_DETAILS_DATA.map((n) => ({
    url: `${BASE_URL}/nurses/${n.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const telemedicineRoutes: MetadataRoute.Sitemap = TELEMEDICINE_SPECIALIZATIONS.map((s) => ({
    url: `${BASE_URL}/telemedicine/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllNewsSlugs().map((slug) => ({
    url: `${BASE_URL}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const doctorRoutes: MetadataRoute.Sitemap = doctorSlugs.map((slug) => ({
    url: `${BASE_URL}/doctors/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const hospitalRoutes: MetadataRoute.Sitemap = hospitalSlugs.map((slug) => ({
    url: `${BASE_URL}/hospitals/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...doctorRoutes, ...hospitalRoutes, ...nurseRoutes, ...telemedicineRoutes, ...blogRoutes];
}
