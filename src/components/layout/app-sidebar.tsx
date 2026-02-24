"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  User,
  ArrowRight,
  Github,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
];

interface SidebarContentProps {
  collapsed: boolean;
}

export function SidebarContent({ collapsed }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Logo & Identity */}
      <div className="p-4 border-b border-border/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-bold text-sm">
            {APP_CONFIG.appName.charAt(0)}
          </span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-semibold text-sm leading-tight">
              {APP_CONFIG.appName}
            </h1>
            <p className="text-[10px] text-muted-foreground/60 font-mono tracking-widest uppercase flex items-center gap-1.5">
              Proposal Demo
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/60" />
              </span>
            </p>
          </div>
        )}
      </div>

      {/* App Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-100",
                isActive
                  ? "bg-primary/8 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/80"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Cross-tab links */}
        <div className="pt-2 mt-2 border-t border-border/60 space-y-1">
          <Link
            href="/challenges"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted/80 transition-colors duration-100"
          >
            <Lightbulb className="w-4 h-4 shrink-0" />
            {!collapsed && <span>My Approach</span>}
          </Link>
          <Link
            href="/proposal"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted/80 transition-colors duration-100"
          >
            <User className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Work With Me</span>}
          </Link>
        </div>
      </nav>

      {/* Micro-CTA Card */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="linear-card p-3 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <p className="text-xs font-medium text-foreground mb-1">
              Like what you see?
            </p>
            <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
              Built this for your project. Let&apos;s talk.
            </p>
            <Link
              href="/proposal"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
            >
              View proposal <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-border/40 p-2 space-y-1">
      {!collapsed && (
        <p className="px-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground/60">
          Proposal Demo
        </p>
      )}
      {!collapsed && (
        <p className="px-3 text-xs text-muted-foreground/80">
          Built for{" "}
          <span className="text-foreground/70 font-medium">
            {APP_CONFIG.projectName}
          </span>
        </p>
      )}
      <a
        href="https://github.com/HumamAl"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] text-primary/70 hover:text-primary hover:bg-primary/8 transition-colors duration-100"
      >
        <Github className="w-3.5 h-3.5 shrink-0" />
        {!collapsed && <span>by Humam ↗</span>}
      </a>
    </div>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-full border-r border-border/60 bg-card hidden md:flex flex-col transition-all duration-150",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent collapsed={collapsed} />

      <SidebarFooter collapsed={collapsed} />

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border/60">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted/80 w-full transition-colors duration-100"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
