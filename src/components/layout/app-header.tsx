"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent, SidebarFooter } from "./app-sidebar";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-14 border-b border-border/60 bg-background flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2.5 rounded-md hover:bg-muted/80 transition-colors duration-100">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <SidebarContent collapsed={false} />
              <SidebarFooter collapsed={false} />
            </SheetContent>
          </Sheet>
          <h2 className="text-sm font-medium">{title}</h2>
          <span className="md:hidden text-[10px] text-muted-foreground/50 font-mono">
            by Humam
          </span>
        </div>
        <Link
          href="/proposal"
          className="hidden md:inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors duration-100"
        >
          View Proposal →
        </Link>
      </div>
    </header>
  );
}
