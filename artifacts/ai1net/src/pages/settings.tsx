import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/react";
import { useGetMe, getGetMeQueryKey, useUpdateMe } from "@workspace/api-client-react";
import { User, Shield, Moon, Sun, Save, LogOut, ExternalLink } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"identity" | "interface" | "links">("identity");

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

    updateMutation.mutate(
      { data: { name } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        }
      }
    );
  };

  const tabStyle = (tab: string) =>
    `w-full text-left p-3 brutalist-border transition-colors ${
      activeTab === tab
        ? "bg-primary text-black"
        : "bg-card text-muted-foreground hover:bg-muted"
    }`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-end justify-between border-b-[4px] border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Configuration</h1>
          <p className="font-mono text-muted-foreground mt-2">SYSTEM.PREFS // NODE.IDENTITY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* SIDEBAR */}
        <div className="space-y-2 font-mono font-bold text-sm uppercase">
          <button onClick={() => setActiveTab("identity")} className={tabStyle("identity")}>
            User Identity
          </button>
          <button onClick={() => setActiveTab("interface")} className={tabStyle("interface")}>
            Interface
          </button>
          <button onClick={() => setActiveTab("links")} className={tabStyle("links")}>
            Links
          </button>
        </div>

        {/* MAIN */}
        <div className="md:col-span-2 space-y-8 transition-all duration-300">

          {/* =========================
              IDENTITY
          ========================= */}
          {activeTab === "identity" && (
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
                    <label className="font-bold uppercase text-sm block">
                      NODE_ID (EMAIL)
                    </label>
                    <div className="w-full bg-muted border-2 border-black dark:border-white p-3 font-mono text-muted-foreground">
                      {clerkUser?.primaryEmailAddress?.emailAddress ?? "UNKNOWN"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="display_alias" className="font-bold uppercase text-sm block">
                      DISPLAY_ALIAS
                    </label>
                    <input
                      id="display_alias"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your alias"
                      className="w-full bg-background border-[3px] border-black dark:border-white p-3 font-mono font-bold focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updateMutation.isPending || !name.trim()}
                    className="brutalist-button bg-primary text-black px-6 py-3 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" />
                    {updateMutation.isPending ? "SAVING..." : "SAVE CONFIG"}
                  </button>
                </form>
              )}
            </section>
          )}

          {/* =========================
              INTERFACE
          ========================= */}
          {activeTab === "interface" && (
            <section className="brutalist-card bg-card p-6 md:p-8 space-y-6">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2 border-b-[3px] border-black dark:border-white pb-2">
                <Sun className="w-6 h-6" /> Interface
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`brutalist-button py-4 flex flex-col items-center gap-2 ${
                    theme === "light" ? "bg-primary text-black" : ""
                  }`}
                >
                  <Sun className="w-6 h-6" />
                  LIGHT_MODE
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={`brutalist-button py-4 flex flex-col items-center gap-2 ${
                    theme === "dark" ? "bg-primary text-black" : "bg-black text-white"
                  }`}
                >
                  <Moon className="w-6 h-6" />
                  DARK_MODE
                </button>
              </div>
            </section>
          )}

          {/* =========================
              LINKS
          ========================= */}
          {activeTab === "links" && (
            <section className="brutalist-card bg-card p-6 md:p-8 space-y-6">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2 border-b-[3px] border-black dark:border-white pb-2">
                <ExternalLink className="w-6 h-6" /> Network Links
              </h2>

              <div className="grid grid-cols-1 gap-3 font-mono text-sm">
                {[
                  ["WEBSITE", "https://ai1net.xyz"],
                  ["X (TWITTER)", "https://x.com/AI1Net"],
                  ["TELEGRAM", "https://t.me/Ai1_Net"],
                  ["DOCUMENTATION", "https://docs.ai1net.xyz"],
                  ["GITHUB", "https://github.com/AI1Net"],
                ].map(([label, url]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutalist-button p-3 flex justify-between"
                  >
                    {label}
                    <span>↗</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* =========================
              LOGOUT (ALWAYS VISIBLE)
          ========================= */}
          <section className="brutalist-card bg-destructive/10 border-destructive p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-black uppercase text-destructive flex items-center gap-2">
              <Shield className="w-6 h-6" /> Danger Zone
            </h2>

            <button
              onClick={() => signOut()}
              className="brutalist-button bg-destructive text-destructive-foreground px-6 py-3 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              DISCONNECT NODE
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}