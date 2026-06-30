import { APP_DOWNLOAD_DATA } from "@/data/app-download.data";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const AppDownloadSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("bg-primary/10 overflow-hidden py-10 md:py-14", className)}
    >
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Content */}
          <div className="flex flex-col lg:w-3/5">
            {/* Badge */}
            <div className="mb-4">
              <span className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-semibold">
                Download Our App
              </span>
            </div>

            {/* Title */}
            <h2 className="text-foreground mb-3 text-2xl leading-tight font-bold lg:text-3xl">
              {APP_DOWNLOAD_DATA.title}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              {APP_DOWNLOAD_DATA.description}
            </p>

            {/* Benefits */}
            <ul className="mb-8 space-y-3">
              {APP_DOWNLOAD_DATA.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md">
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-foreground text-sm font-medium">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Store badges */}
            <div className="flex items-center gap-4">
              <a
                href={APP_DOWNLOAD_DATA.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform"
              >
                <Image
                  src="/images/play-store.png"
                  alt="Get It On Google Play"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
              </a>
              <a
                href={APP_DOWNLOAD_DATA.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform"
              >
                <Image
                  src="/images/app-store.png"
                  alt="Download on the App Store"
                  width={200}
                  height={60}
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Phone mockup with decorative circle */}
          <div className="relative flex justify-center lg:w-2/5">
            <Image
              src="/images/mockups/app-mockup.svg"
              alt="My Doctor Mobile App"
              width={320}
              height={640}
              className="relative z-10 h-auto w-64 object-contain lg:w-80"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
