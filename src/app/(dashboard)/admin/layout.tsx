"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Music2,
  Home,
  BookOpen,
  Users,
  CreditCard,
  BarChart3,
  DollarSign,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Bell,
  Search,
  Menu,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const adminNavKeys = [
  { key: "admin_dashboard", href: "/admin", icon: Home },
  { key: "users", href: "/admin/users", icon: Users },
  { key: "admin_courses", href: "/admin/courses", icon: BookOpen },
  { key: "subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { key: "statistics", href: "/admin/analytics", icon: BarChart3 },
  { key: "financial_remuneration", href: "/admin/finances", icon: DollarSign },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 h-16 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold font-heading whitespace-nowrap">
              <span className="font-bold text-xl tracking-tight">Aty<span className="gradient-text-purple">ef</span></span>
            </span>
          )}
        </Link>
      </div>

      <Separator className="bg-white/5" />

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 w-fit">
            <Shield className="w-3 h-3 text-red-400" />
            <span className="text-xs font-medium text-red-400">{t("admin_space")}</span>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {adminNavKeys.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-red-500/15 text-red-400"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon
                  className={`w-4.5 h-4.5 shrink-0 ${
                    isActive ? "text-red-400" : "text-muted-foreground group-hover:text-white"
                  }`}
                />
                {!collapsed && <span className="truncate">{t(item.key as any)}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Platform Stats Widget */}
        {!collapsed && (
          <div className="mt-6 mx-1 p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{t("platform_label")}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{t("users")}</span>
                <span className="text-xs font-bold text-white">2 847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{t("active_subscriptions")}</span>
                <span className="text-xs font-bold text-emerald-400">1 832</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{t("revenue_month")}</span>
                <span className="text-xs font-bold text-white">€ 28 450</span>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="shrink-0 p-3 border-t border-white/5">
        <DropdownMenu>
          <DropdownMenuTrigger className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors ${collapsed ? "justify-center" : ""}`}>
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-white truncate">Admin</p>
                  <p className="text-xs text-red-400">{t("admin_space")}</p>
                </div>
              )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Link href="/admin" className="flex w-full items-center gap-2">
                <Settings className="w-4 h-4" /> Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/" className="flex w-full items-center gap-2 text-destructive">
                <LogOut className="w-4 h-4" /> Déconnexion
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className={`hidden lg:flex flex-col border-r border-white/5 bg-[oklch(0.13_0.015_280)] transition-all duration-300 ${collapsed ? "w-[68px]" : "w-64"}`}>
        <SidebarContent />
        <button onClick={() => setCollapsed(!collapsed)} className="absolute top-20 -right-3 w-6 h-6 rounded-full bg-[oklch(0.2_0.02_280)] border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-[oklch(0.25_0.02_280)] transition-colors z-10" style={{ left: collapsed ? "56px" : "248px" }}>
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />}

      <aside className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-[oklch(0.13_0.015_280)] border-r border-white/5 z-50 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Rechercher un utilisateur..." className="pl-9 w-64 h-9 bg-white/5 border-white/10 text-white text-sm placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
