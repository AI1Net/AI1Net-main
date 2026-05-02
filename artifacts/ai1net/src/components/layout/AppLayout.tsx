import { Link, useLocation } from "wouter";
import { useAuth, useUser } from "@clerk/react";
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Award, 
  Coins, 
  Settings,
  LogOut,
  Terminal,
  Activity
} from "lucide-react";
import { useGetTokenBalance } from "@workspace/api-client-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { data: tokenBalance } = useGetTokenBalance();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/explore", label: "Explore Models", icon: Search },
    { href: "/usage", label: "Usage History", icon: History },
    { href: "/rewards", label: "Rewards", icon: Award },
    { href: "/token", label: "Token & Gov", icon: Coins },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r-[3px] border-black dark:border-white bg-card z-10 shrink-0">
        <div className="h-16 flex items-center px-6 border-b-[3px] border-black dark:border-white bg-primary">
          <Terminal className="w-6 h-6 mr-2 text-black" />
          <span className="font-black text-xl tracking-widest text-black">AI1NET</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
          <div className="text-xs font-mono font-bold text-muted-foreground mb-2 px-2">SYSTEM.NAV</div>
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center px-4 py-3 font-bold uppercase tracking-wider text-sm transition-colors border-[2px] ${
                  isActive 
                    ? "bg-primary text-black border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]" 
                    : "border-transparent hover:border-black dark:hover:border-white hover:bg-accent/10"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-[3px] border-black dark:border-white">
          <button 
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-3 font-bold uppercase tracking-wider text-sm border-[2px] border-transparent hover:border-black dark:hover:border-white hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            DISCONNECT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b-[3px] border-black dark:border-white bg-card shrink-0">
          <div className="flex items-center">
            <div className="flex items-center px-3 py-1 bg-black text-primary font-mono text-sm font-bold border-2 border-primary">
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              STATUS: ONLINE
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-1.5 border-[3px] border-black dark:border-white bg-white dark:bg-black font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <span className="text-muted-foreground">BALANCE:</span>
              <span className="text-primary dark:text-primary filter drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">{tokenBalance?.balance?.toLocaleString() || 0} A1N</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold uppercase">{user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0]}</div>
                <div className="text-xs font-mono text-muted-foreground">NODE_OP</div>
              </div>
              <div className="w-10 h-10 border-[3px] border-black dark:border-white overflow-hidden bg-primary">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover grayscale contrast-125" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold">{user?.fullName?.[0] || '?'}</div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
