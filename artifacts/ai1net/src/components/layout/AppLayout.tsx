import { Link, useLocation } from "wouter";
import { useAuth, useUser } from "@clerk/react";
import { useState } from "react";
import {
  LayoutDashboard, Search, History, Award, Coins, Settings,
  LogOut, Terminal, Activity, Menu
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

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-card border-r-4 transform transition-transform 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        <div className="h-16 flex items-center px-6 border-b-4 bg-primary">
          <Terminal className="w-5 h-5 mr-2" />
          <span className="font-black">AI1NET</span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center px-3 py-2 border-2 text-sm font-bold uppercase
                  ${isActive ? "bg-primary text-black" : "hover:bg-muted"}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={() => signOut()} className="flex w-full items-center px-3 py-2 border-2 text-sm font-bold">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b-4 bg-card">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <Menu />
            </button>

            <div className="hidden sm:flex items-center px-2 py-1 bg-black text-primary text-xs font-mono">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              ONLINE
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 md:gap-6">

            <div className="px-2 md:px-4 py-1 border-2 text-xs md:text-sm font-mono">
              {tokenBalance?.balance?.toLocaleString() || 0} A1N
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right text-xs md:text-sm font-bold">
                {user?.fullName || "User"}
              </div>

              <div className="w-8 h-8 md:w-10 md:h-10 border-2 overflow-hidden">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : "?"}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}