import { SITE } from "@/config/site";

export type TContactInfo = {
  id: string;
  title: string;
  description?: string;
  value: string;
  icon: string;
};

export const CONTACT_PAGE_DATA = {
  header: {
    title: "Get in Touch",
    description: "Have questions or need assistance? Our team is here to help you 24/7.",
  },
  info: [
    {
      id: "phone",
      title: "Call Center",
      description: "Available 24/7 for you",
      value: SITE.contact.phones.join(" / "),
      icon: "Call02Icon",
    },
    {
      id: "whatsapp",
      title: "WhatsApp Support",
      description: "Chat with our experts",
      value: SITE.contact.whatsapp.join(" / "),
      icon: "WhatsappIcon",
    },
    {
      id: "email",
      title: "Email Support",
      description: "Our team can help you at",
      value: SITE.contact.email,
      icon: "Mail01Icon",
    },
    {
      id: "address",
      title: "Our Office",
      description: "Visit our headquarters",
      value: SITE.contact.address,
      icon: "Location01Icon",
    },
  ],
  form: {
    title: "Send us a Message",
    description: "Fill out the form below and we will get back to you as soon as possible.",
  },
};
