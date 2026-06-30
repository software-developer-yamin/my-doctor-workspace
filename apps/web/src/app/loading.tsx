import { LogoIcon } from "@/components/icons/logo-icon";

export default function Loading() {
  return (
    <div className="bg-background/80 fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer Ring */}
          <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />

          {/* Logo with pulse effect */}
          <div className="relative animate-pulse">
            <LogoIcon className="text-primary h-16 w-16" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            My Doctor
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full" />
            <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.2s]" />
            <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
}
