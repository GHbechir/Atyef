"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Music2,
  Home,
  BookOpen,
  Wrench,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BarChart3,
  Users,
  CreditCard,
  Shield,
  PlusCircle,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Navigation items per role
const learnerNav = [
  { name: "Tableau de bord", href: "/learn", icon: Home },
  { name: "Mes cours", href: "/learn/courses", icon: BookOpen },
  { name: "Outils", href: "/learn/tools", icon: Wrench },
  { name: "Mon profil", href: "/learn/profile", icon: User },
];

const teacherNav = [
  { name: "Tableau de bord", href: "/teach", icon: Home },
  { name: "Mes cours", href: "/teach/courses", icon: BookOpen },
  { name: "Créer un cours", href: "/teach/courses/new", icon: PlusCircle },
  { name: "Mes élèves", href: "/teach/students", icon: Users },
  { name: "Revenus", href: "/teach/revenue", icon: CreditCard },
];

const adminNav = [
  { name: "Tableau de bord", href: "/admin", icon: Home },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Cours", href: "/admin/courses", icon: BookOpen },
  { name: "Abonnements", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

function getNavItems(pathname: string) {
  if (pathname.startsWith("/admin")) return { items: adminNav, role: "Administrateur", roleColor: "text-red-400" };
  if (pathname.startsWith("/teach")) return { items: teacherNav, role: "Professeur", roleColor: "text-amber-400" };
  return { items: learnerNav, role: "Apprenant", roleColor: "text-emerald-400" };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { items, role, roleColor } = getNavItems(pathname);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
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

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon
                  className={`w-4.5 h-4.5 shrink-0 ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                  }`}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Quick Switch */}
        {!collapsed && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 mb-2">
              Changer d&apos;espace
            </p>
            <div className="space-y-1">
              <Link
                href="/learn"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  pathname.startsWith("/learn") ? "text-emerald-400 bg-emerald-500/10" : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Apprenant
              </Link>
              <Link
                href="/teach"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  pathname.startsWith("/teach") ? "text-amber-400 bg-amber-500/10" : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Professeur
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  pathname.startsWith("/admin") ? "text-red-400 bg-red-500/10" : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* User Section */}
      <div className="shrink-0 p-3 border-t border-white/5">
        <DropdownMenu>
          <DropdownMenuTrigger className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 transition-colors ${collapsed ? "justify-center" : ""}`}>
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                  ML
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-white truncate">Marie Laurent</p>
                  <p className={`text-xs ${roleColor}`}>{role}</p>
                </div>
              )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Link href="/learn/profile" className="flex w-full items-center gap-2">
                <User className="w-4 h-4" /> Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/learn/profile" className="flex w-full items-center gap-2">
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
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-white/5 bg-[oklch(0.13_0.015_280)] transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        <SidebarContent />
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-20 -right-3 w-6 h-6 rounded-full bg-[oklch(0.2_0.02_280)] border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-[oklch(0.25_0.02_280)] transition-colors z-10"
          style={{ left: collapsed ? "56px" : "248px" }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-[oklch(0.13_0.015_280)] border-r border-white/5 z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-9 w-64 h-9 bg-white/5 border-white/10 text-white text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
