export type TAboutValue = {
  id: string;
  number: string;
  title: string;
  description: string;
};

export type TAboutStoryData = {
  label: string;
  title: string;
  description: string[];
  image: string;
};

export type TAboutValuesData = {
  label: string;
  title: string;
  items: TAboutValue[];
};

export type TAboutVisionData = {
  label: string;
  title: string;
  description: string;
};

export const ABOUT_STORY_DATA: TAboutStoryData = {
  label: "Our Mission",
  title: "Making healthcare accessible for every citizen.",
  description: [
    "Our journey began with a singular focus: to revolutionize the way healthcare is accessed in Bangladesh. By integrating advanced technology with compassionate care, we aim to eliminate the barriers that prevent individuals from receiving timely medical attention.",
    "Through our platform, we connect patients to a vast network of BMDC verified specialists, emergency ambulance services, and certified diagnostic centers. We are dedicated to providing a seamless, secure, and user-friendly experience for everyone, regardless of their location.",
    "We believe that healthcare is a fundamental right, and our mission is to ensure that quality medical support is always within reach. By focusing on innovation and trust, we continue to evolve our services to meet the growing healthcare needs of our nation.",
  ],
  image: "/images/about/healthcare-team.png",
};

export const ABOUT_VALUES_DATA: TAboutValuesData = {
  label: "Core Values",
  title: "Why Choose My Doctor?",
  items: [
    {
      id: "v1",
      number: "1",
      title: "Verified Experts",
      description:
        "Every doctor on our platform is BMDC verified with years of proven hospital experience.",
    },
    {
      id: "v2",
      number: "2",
      title: "24/7 Support",
      description:
        "Whether it is a midnight emergency or a morning query, our emergency services are always active.",
    },
    {
      id: "v3",
      number: "3",
      title: "Data Privacy",
      description:
        "Your medical records are encrypted and only accessible by your assigned healthcare providers.",
    },
  ],
};

export const ABOUT_VISION_DATA: TAboutVisionData = {
  label: "Our Vision",
  title: "Our Vision for the Future",
  description:
    "We are not just building an app; we are building a healthier Bangladesh. Our goal is to expand our reach to the remotest corners of the country, ensuring that the best medical advice is never more than a click away.",
};
