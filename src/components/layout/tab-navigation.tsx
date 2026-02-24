"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";

const tabs = [
  { label: "Live Demo", href: "/" },
  { label: "My Approach", href: "/challenges" },
  { label: "Work With Me", href: "/proposal" },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border/60 backdrop-blur-xl bg-background/90 sticky top-0 z-50">
      <div className="flex items-center">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/" || (!pathname.startsWith("/challenges") && !pathname.startsWith("/proposal"))
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-3 md:px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-100 text-center flex-1 md:flex-none",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground/80"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
        <div className="ml-auto flex items-center pr-4">
          <span className="hidden md:block font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50">
            Demo for {APP_CONFIG.projectName}
          </span>
        </div>
      </div>
    </nav>
  );
}
