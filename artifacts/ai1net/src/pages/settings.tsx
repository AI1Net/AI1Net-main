import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/react";
import { useGetMe, getGetMeQueryKey, useUpdateMe } from "@workspace/api-client-react";
import { User, Shield, Moon, Sun, Save, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";

export default function Settings() {
  const { user: clerkUser } = useUser();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const { data: dbUser, isLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey() }
  });

  const updateMutation = useUpdateMe();

  const [name, setName] = useState("");
  
  useEffect(() => {
    if (dbUser?.name) {
      setName(dbUser.name);
    } else if (clerkUser?.fullName) {
      setName(clerkUser.fullName);
    }
  }, [dbUser, clerkUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateMutation.mutate({ data: { name } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        // Could add a toast here if configured
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-end justify-between border-b-[4px] border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Configuration</h1>
          <p className="font-mono text-muted-foreground mt-2">SYSTEM.PREFS // NODE.IDENTITY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar inside settings */}
        <div className="space-y-2 font-mono font-bold text-sm uppercase">
          <button className="w-full text-left p-3 brutalist-border bg-primary text-black">
            User Identity
          </button>
          <button className="w-full text-left p-3 brutalist-border bg-card hover:bg-muted transition-colors text-muted-foreground">
            Interface
          </button>
          <button className="w-full text-left p-3 brutalist-border bg-card hover:bg-muted transition-colors text-muted-foreground">
            Security
          </button>
        </div>

        {/* Main Panel */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Identity Section */}
          <section className="brutalist-card bg-card p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-black uppercase flex items-center gap-2 border-b-[3px] border-black dark:border-white pb-2">
              <User className="w-6 h-6" /> Identity Profile
            </h2>
            
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-muted w-full"></div>
                <div className="h-10 bg-muted w-full"></div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-bold uppercase text-sm block">NODE_ID (EMAIL)</label>
                  <div className="w-full bg-muted border-2 border-black dark:border-white p-3 font-mono text-muted-foreground select-none">
                    {clerkUser?.primaryEmailAddress?.emailAddress || "UNKNOWN"}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">Primary identifier cannot be changed.</p>
                </div>

                <div className="space-y-2">
                  <label className="font-bold uppercase text-sm block">DISPLAY_ALIAS</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border-[3px] border-black dark:border-white p-3 font-mono font-bold focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={updateMutation.isPending || !name.trim() || name === dbUser?.name}
                    className="brutalist-button bg-primary text-black px-6 py-3 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5"/> 
                    {updateMutation.isPending ? "SAVING..." : "SAVE CONFIG"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Interface Section */}
          <section className="brutalist-card bg-card p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-black uppercase flex items-center gap-2 border-b-[3px] border-black dark:border-white pb-2">
              <Sun className="w-6 h-6" /> Interface
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-bold uppercase text-sm block">COLOR_SCHEME</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme("light")}
                    className={`brutalist-button py-4 flex flex-col items-center gap-2 ${theme === 'light' ? 'bg-primary text-black' : 'bg-background hover:bg-muted'}`}
                  >
                    <Sun className="w-6 h-6" />
                    LIGHT_MODE
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`brutalist-button py-4 flex flex-col items-center gap-2 ${theme === 'dark' ? 'bg-primary text-black' : 'bg-black text-white hover:bg-black/90'}`}
                  >
                    <Moon className="w-6 h-6" />
                    DARK_MODE
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="brutalist-card bg-destructive/10 border-destructive p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-black uppercase text-destructive flex items-center gap-2">
              <Shield className="w-6 h-6" /> Danger Zone
            </h2>
            <p className="font-mono text-sm text-muted-foreground">Terminate current session and disconnect from the network.</p>
            <button 
              onClick={() => signOut()}
              className="brutalist-button bg-destructive text-destructive-foreground px-6 py-3 flex items-center gap-2 hover:bg-red-700"
            >
              <LogOut className="w-5 h-5"/>
              DISCONNECT NODE
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}