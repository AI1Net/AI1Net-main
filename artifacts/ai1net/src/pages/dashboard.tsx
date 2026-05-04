import { useGetDashboardSummary, useGetDashboardActivity, useGetToolsUsageSummary, getGetDashboardSummaryQueryKey, getGetDashboardActivityQueryKey, getGetToolsUsageSummaryQueryKey } from "@workspace/api-client-react";
import { Activity, Zap, TrendingUp, Cpu, Server, History } from "lucide-react";
import type { ActivityItem, ToolUsageSummary } from "@workspace/api-client-react";
import WalletConnect from "@/components/WalletConnect";

export default function Dashboard() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: activityRes, isLoading: isActivityLoading } = useGetDashboardActivity({ limit: 10 }, { query: { queryKey: getGetDashboardActivityQueryKey({ limit: 10 }) } });
  const { data: toolsUsageRes, isLoading: isToolsLoading } = useGetToolsUsageSummary({ query: { queryKey: getGetToolsUsageSummaryQueryKey() } });
  const activity: ActivityItem[] = Array.isArray(activityRes) ? activityRes : []
  const toolsUsage: ToolUsageSummary[] = Array.isArray(toolsUsageRes) ? toolsUsageRes : []
  console.log("activityRes:", activityRes)
  console.log("toolsUsageRes:", toolsUsageRes)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between border-b-[4px] border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">System Status</h1>
          <p className="font-mono text-muted-foreground mt-2">GLOBAL.OVERVIEW // LIVE_METRICS</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <WalletConnect />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Requests Today" value={summary?.requestsToday?.toLocaleString() || "0"} icon={Activity} color="bg-secondary" />
        <StatCard title="Tokens Spent" value={summary?.tokensSpentToday?.toLocaleString() || "0"} icon={Zap} color="bg-primary" />
        <StatCard title="Rewards Earned" value={summary?.totalRewardsEarned?.toLocaleString() || "0"} icon={TrendingUp} color="bg-accent" />
        <StatCard title="Active Models" value={summary?.activeModels?.toString() || "0"} icon={Cpu} color="bg-destructive" textColor="text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6" />
            <h2 className="text-2xl font-black uppercase border-b-2 border-black dark:border-white pb-1">Activity Log</h2>
          </div>
          
          <div className="brutalist-card p-0 bg-card overflow-hidden">
            {isActivityLoading ? (
              <div className="p-8 text-center font-mono animate-pulse">FETCHING LOGS...</div>
            ) : activity.length > 0 ? (
              <div className="divide-y-[3px] divide-black dark:divide-white">
                {activity.map((item: ActivityItem) => (
                  <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors flex items-start gap-4">
                    <div className="mt-1 px-2 py-1 bg-black text-white font-mono text-xs font-bold border-2 border-black dark:border-white">
                      {item.type}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg uppercase">{item.title}</div>
                      <div className="text-sm font-mono text-muted-foreground mt-1">{item.description}</div>
                    </div>
                    {item.amount && (
                      <div className="font-black text-lg whitespace-nowrap">
                        {item.amount > 0 ? "+" : ""}{item.amount} A1N
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center font-mono text-muted-foreground">NO ACTIVITY DETECTED</div>
            )}
          </div>
        </div>

        {/* Top Tools */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6" />
            <h2 className="text-2xl font-black uppercase border-b-2 border-black dark:border-white pb-1">Top Tools</h2>
          </div>

          <div className="space-y-4">
            {isToolsLoading ? (
              <div className="brutalist-card p-6 text-center font-mono animate-pulse">ANALYZING USAGE...</div>
            ) : toolsUsage?.length ? (
              toolsUsage.map((tool: ToolUsageSummary, idx: number) => (
                <div key={tool.toolId} className="brutalist-card p-4 relative group hover:-translate-y-1 transition-transform">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary border-[3px] border-black dark:border-white text-black font-black flex items-center justify-center text-lg z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {idx + 1}
                  </div>
                  <div className="font-black text-xl truncate pr-6 uppercase">{tool.toolName}</div>
                  <div className="mt-3 flex justify-between items-end font-mono text-sm">
                    <div>
                      <div className="text-muted-foreground">REQUESTS</div>
                      <div className="font-bold">{tool.requestCount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">TOKENS</div>
                      <div className="font-bold">{tool.tokensSpent.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="brutalist-card p-6 text-center font-mono text-muted-foreground">NO USAGE DATA</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, textColor = "text-black" }: { title: string, value: string, icon: any, color: string, textColor?: string }) {
  return (
    <div className={`brutalist-card p-6 ${color} ${textColor} relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
      <Icon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
      <div className="relative z-10">
        <div className="font-mono text-sm font-bold opacity-80 uppercase">{title}</div>
        <div className="mt-2 text-4xl font-black tracking-tighter filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] dark:drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">
          {value}
        </div>
      </div>
    </div>
  );
}