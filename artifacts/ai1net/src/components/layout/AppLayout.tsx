import { Link, useLocation } from "wouter";
import { useAuth, useUser } from "@clerk/react";
import { useState } from "react";
import {
  LayoutDashboard, Search, History, Award, Coins, Settings,
  LogOut, Terminal, Activity, Menu, Bug
} from "lucide-react";

import { useGetTokenBalance } from "@workspace/api-client-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { data: tokenBalance } = useGetTokenBalance();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/explore", label: "Explore", icon: Search },
    { href: "/usage", label: "Usage", icon: History },
    { href: "/rewards", label: "Rewards", icon: Award },
    { href: "/token", label: "Token", icon: Coins },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 bg-white text-black p-2 z-50"
      >
        Skip to content
      </a>

      {/* Overlay (mobile) */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        id="sidebar"
        aria-label="Main navigation"
        className={`
          fixed md:static
          top-0 left-0 z-50
          h-full md:h-screen
          w-64 min-w-64
          bg-card border-r-4 border-black
          transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b-4 border-black bg-primary shrink-0">
          <Terminal className="w-5 h-5 mr-2" />
          <span className="font-black tracking-wide">AI1NET</span>
        </div>

        {/* Navigation */}
        <nav aria-label="Sidebar navigation" className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex items-center px-3 py-2 border-2 text-sm font-bold uppercase
                  transition-all focus:outline-none focus:ring-2 focus:ring-primary

                  ${isActive
                    ? "bg-primary text-black border-black"
                    : "border-transparent hover:bg-muted"}
                `}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => signOut()}
            aria-label="Logout"
            className="flex w-full items-center px-3 py-2 border-2 border-black text-sm font-bold hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 border-b-4 border-black bg-card">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="sidebar"
              className="md:hidden focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center px-2 py-1 bg-black text-primary text-xs font-mono">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              ONLINE
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            <div className="px-3 py-1 border-2 border-black text-sm font-mono">
              {tokenBalance?.balance?.toLocaleString() || 0} A1N
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-sm font-bold">
                {user?.fullName || "User"}
              </div>

              <div className="w-9 h-9 border-2 border-black overflow-hidden flex items-center justify-center">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User avatar"}
                    title={user.fullName || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span aria-label="No profile image" className="text-xs">?</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-4 md:p-10">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}