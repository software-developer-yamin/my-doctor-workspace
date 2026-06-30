"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect } from "react";
import {
  Calendar03Icon,
  Settings01Icon,
  Book02Icon,
  AmbulanceIcon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface TMenuItem {
  title: string;
  href: string;
  icon: any;
  disabled?: boolean;
}

const mainNavigation: TMenuItem[] = [
  {
    title: "Appointments",
    href: "/patient/appointments",
    icon: Calendar03Icon,
  },
  {
    title: "Ambulance Bookings",
    href: "/patient/ambulance-bookings",
    icon: AmbulanceIcon,
  },
  {
    title: "Diagnostic Tests",
    href: "/patient/diagnostic-bookings",
    icon: TestTube01Icon,
  },
  {
    title: "Hospital Guide",
    href: "/patient/guide-bookings",
    icon: Book02Icon,
  },
];

const secondaryNavigation: TMenuItem[] = [
  {
    title: "Profile Settings",
    href: "/patient/profile-settings",
    icon: Settings01Icon,
  },
];

export function PatientSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="top-14 lg:top-16 h-[calc(100vh-56px)] lg:h-[calc(100vh-64px)] border-r border-sidebar-border bg-sidebar transition-all duration-300"
    >
      <SidebarContent className="px-3 no-scrollbar space-y-4 pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-micro font-bold uppercase tracking-[0.2em] text-muted-foreground/50 group-data-[collapsible=icon]:hidden">
            Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "relative h-11 w-full justify-start rounded-md px-4 transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-xs"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <HugeiconsIcon
                          icon={item.icon}
                          size={18}
                          className={cn(
                            "transition-colors shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-sidebar-foreground"
                          )}
                        />
                        <span className="text-body-sm group-data-[collapsible=icon]:opacity-0 transition-opacity">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full group-data-[collapsible=icon]:h-6" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-micro font-bold uppercase tracking-[0.2em] text-muted-foreground/50 group-data-[collapsible=icon]:hidden text-nowrap">
            Support & Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "relative h-11 w-full justify-start rounded-md px-4 transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <HugeiconsIcon
                          icon={item.icon}
                          size={18}
                          className={cn(
                            "transition-colors shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground/80 group-hover:text-sidebar-foreground"
                          )}
                        />
                        <span className="text-body-sm group-data-[collapsible=icon]:opacity-0 transition-opacity">
                          {item.title}
                        </span>
                        {isActive && (
                          <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full group-data-[collapsible=icon]:h-6" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
