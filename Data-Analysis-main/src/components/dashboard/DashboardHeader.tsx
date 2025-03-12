"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle, Settings, LogOut, Database } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const DashboardHeader = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "",
  notificationCount = 3,
}: DashboardHeaderProps) => {
  return (
    <header className="w-full h-20 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">DataAnalytics</span>
        </Link>

        <nav className="hidden md:flex ml-10">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
