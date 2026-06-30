"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { MenuIcon } from "@/components/icons/header-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { startTransition, useEffect, useState } from "react";
import { CONSTANT } from "@/config/constant";
import { cn } from "@/lib/utils";
import { logout } from "@/redux/slices/auth-slice";
import { RootState } from "@/redux/store";
import {
  AmbulanceIcon,
  Book02Icon,
  BookOpen01Icon,
  Calendar03Icon,
  Logout01Icon,
  MedicineBottle01Icon,
  Settings01Icon,
  TestTube01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AuthModal } from "@/components/auth/auth-modal";

export const Header = ({
  className,
  layout,
}: {
  className?: string;
  layout?: "primary" | "dashboard";
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const IS_SIGNED_IN = isAuthenticated && !!user;
  const isDoctor = user?.role === "doctor";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMobileProfileOpen(false);
      setDesktopProfileOpen(false);
    });
  }, [pathname]);

  const handleLogout = () => {
    queryClient.clear();
    dispatch(logout());
    deleteCookie(CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    deleteCookie("my-doctor-refresh-token");
    deleteCookie(CONSTANT.LOCAL_STORAGE_KEYS.USER_DATA);
    router.push("/");
  };

  const navigation = [
    { name: "Hospital", href: "/hospitals" },
    { name: "Doctor", href: "/doctors" },
    { name: "Ambulance", href: "/ambulances" },
    { name: "Diagnostics", href: "/diagnostics" },
    { name: "Hospital Guide", href: "/guides" },
    ...(IS_SIGNED_IN && !isDoctor
      ? [{ name: "My Prescriptions", href: "/medical-records" }]
      : []),
  ];

  const patientMenuItems = [
    { name: "Profile Settings", href: "/patient/profile-settings", icon: Settings01Icon },
    { name: "Appointments", href: "/patient/appointments", icon: Calendar03Icon },
    { name: "Ambulance Bookings", href: "/patient/ambulance-bookings", icon: AmbulanceIcon },
    { name: "Diagnostic Tests", href: "/patient/diagnostic-bookings", icon: TestTube01Icon },
    { name: "Hospital Guide", href: "/patient/guide-bookings", icon: Book02Icon },
  ];

  const doctorMenuItems = [
    { name: "Today's Appointments", href: "/doctor/appointments", icon: Calendar03Icon },
    { name: "All Bookings", href: "/doctor/bookings", icon: BookOpen01Icon },
    { name: "Profile", href: "/doctor/profile", icon: UserIcon },
  ];

  const userMenuItems = isDoctor ? doctorMenuItems : patientMenuItems;
  const portalLabel = isDoctor ? "Doctor Portal" : "Patient Portal";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      <div className="container">
        {/* ── Mobile row ── */}
        <div className="relative flex h-14 items-center justify-between lg:hidden">
          {/* Hamburger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="text-primary p-1" aria-label="Open menu">
                <MenuIcon className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col gap-1 p-6 pt-10">
                <Link href="/" className="mb-4 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <LogoIcon className="h-8 w-auto" />
                </Link>
                {navigation.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo — absolutely centered */}
          <Link
            href="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center"
          >
            <LogoIcon className="h-8 w-auto" />
          </Link>

          {/* Right: user icon */}
          {IS_SIGNED_IN ? (
            <DropdownMenu open={mobileProfileOpen} onOpenChange={setMobileProfileOpen}>
              <DropdownMenuTrigger className="outline-none">
                <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition-all hover:opacity-90">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "U"}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="!bg-card !text-card-foreground border-border/50 animate-in fade-in zoom-in-95 w-64 rounded-3xl p-3 shadow-2xl duration-200 before:!hidden"
              >
                <div className="bg-muted/30 mb-2 flex items-center gap-3 rounded-2xl p-3">
                  <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-md">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold tracking-tight">
                      {user?.name || "User"}
                    </p>
                    <p className="text-primary text-micro font-medium tracking-wider uppercase">
                      {portalLabel}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-border/50 my-2" />
                {userMenuItems.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    asChild
                    className="focus:bg-primary/5 focus:text-primary group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200"
                  >
                    <Link
                      href={item.href}
                      className="flex w-full items-center gap-3"
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={16}
                        className="text-muted-foreground/60 group-focus:text-primary shrink-0 transition-colors"
                      />
                      <span className="text-xs font-semibold tracking-tight">
                        {item.name}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-border/50 my-2" />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200"
                  onClick={handleLogout}
                >
                  <HugeiconsIcon
                    icon={Logout01Icon}
                    size={16}
                    className="shrink-0 opacity-70"
                  />
                  <span className="text-xs font-semibold tracking-tight">
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthModal>
              <button
                className="border-primary text-primary hover:bg-primary/5 flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95"
                aria-label="Sign in"
              >
                <HugeiconsIcon icon={UserIcon} size={18} />
              </button>
            </AuthModal>
          )}
        </div>

        {/* ── Desktop row ── */}
        <div className="hidden h-16 items-center justify-between lg:flex">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex shrink-0 items-center">
              <LogoIcon className="h-10 w-auto" />
            </Link>
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "hover:text-primary text-gray-700",
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex shrink-0 items-center gap-2">
            {IS_SIGNED_IN ? (
              <DropdownMenu open={desktopProfileOpen} onOpenChange={setDesktopProfileOpen}>
                <DropdownMenuTrigger className="outline-none">
                  <div className="bg-primary/15 text-primary hover:bg-primary/20 focus-visible:ring-primary flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all focus-visible:ring-2 focus-visible:outline-none">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "U"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="!bg-card !text-card-foreground border-border/50 animate-in fade-in zoom-in-95 w-64 rounded-3xl p-3 shadow-2xl duration-200 before:!hidden"
                >
                  {/* User Info Header */}
                  <div className="bg-muted/30 mb-2 flex items-center gap-3 rounded-2xl p-3">
                    <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-md">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold tracking-tight">
                        {user?.name || "User"}
                      </p>
                      <p className="text-primary text-micro font-medium tracking-wider uppercase">
                        {portalLabel}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  {userMenuItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      asChild
                      className="focus:bg-primary/5 focus:text-primary group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200"
                    >
                      <Link
                        href={item.href}
                        className="flex w-full items-center gap-3"
                      >
                        <HugeiconsIcon
                          icon={item.icon}
                          size={16}
                          className="text-muted-foreground/60 group-focus:text-primary shrink-0 transition-colors"
                        />
                        <span className="text-xs font-semibold tracking-tight">
                          {item.name}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-border/50 my-2" />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <HugeiconsIcon
                      icon={Logout01Icon}
                      size={16}
                      className="shrink-0 opacity-70"
                    />
                    <span className="text-xs font-semibold tracking-tight">
                      Logout
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <AuthModal>
                  <button className="border-primary text-primary hover:bg-primary/5 flex h-10 items-center rounded-md border bg-white px-4 text-sm font-medium transition-all active:scale-95">
                    Login
                  </button>
                </AuthModal>
                <Link
                  href="/doctors"
                  className="bg-primary flex h-10 items-center rounded-md px-4 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
