import {
  useGetDashboardSummary,
  useGetDashboardActivity,
  useGetToolsUsageSummary,
  getGetDashboardSummaryQueryKey,
  getGetDashboardActivityQueryKey,
  getGetToolsUsageSummaryQueryKey
} from "@workspace/api-client-react";

import { Activity, Zap, TrendingUp, Cpu, Server, History } from "lucide-react";
import type { ActivityItem, ToolUsageSummary } from "@workspace/api-client-react";
import WalletConnect from "@/components/WalletConnect";

export default function Dashboard() {
  const { data: summary } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });

  const { data: activityRes, isLoading: isActivityLoading } =
    useGetDashboardActivity(
      { limit: 10 },
      { query: { queryKey: getGetDashboardActivityQueryKey({ limit: 10 }) } }
    );

  const { data: toolsUsageRes, isLoading: isToolsLoading } =
    useGetToolsUsageSummary({
      query: { queryKey: getGetToolsUsageSummaryQueryKey() }
    });

  const activity: ActivityItem[] = Array.isArray(activityRes) ? activityRes : [];
  const toolsUsage: ToolUsageSummary[] = Array.isArray(toolsUsageRes) ? toolsUsageRes : [];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-[4px] border-black dark:border-white pb-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
            System Status
          </h1>
          <p className="font-mono text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
            GLOBAL.OVERVIEW // LIVE_METRICS
          </p>
        </div>
      </div>

      {/* Wallet */}
      <div className="flex items-center gap-4">
        <WalletConnect />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Requests Today" value={summary?.requestsToday?.toLocaleString() || "0"} icon={Activity} color="bg-secondary" />
        <StatCard title="Tokens Spent" value={summary?.tokensSpentToday?.toLocaleString() || "0"} icon={Zap} color="bg-primary" />
        <StatCard title="Rewards Earned" value={summary?.totalRewardsEarned?.toLocaleString() || "0"} icon={TrendingUp} color="bg-accent" />
        <StatCard title="Active Models" value={summary?.activeModels?.toString() || "0"} icon={Cpu} color="bg-destructive" textColor="text-white" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* Activity */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader icon={Server} title="Activity Log" />

          <div className="brutalist-card p-0 bg-card overflow-hidden">
            {isActivityLoading ? (
              <div className="p-6 md:p-8 text-center font-mono animate-pulse">
                FETCHING LOGS...
              </div>
            ) : activity.length ? (
              <div className="divide-y-[3px] divide-black dark:divide-white">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:bg-muted/50"
                  >
                    <div className="px-2 py-1 bg-black text-white text-xs font-mono font-bold border-2">
                      {item.type}
                    </div>

                    <div className="flex-1 break-words">
                      <div className="font-bold text-sm md:text-lg uppercase">
                        {item.title}
                      </div>
                      <div className="text-xs md:text-sm font-mono text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    </div>

                    {item.amount && (
                      <div className="font-black text-sm md:text-lg whitespace-nowrap">
                        {item.amount > 0 ? "+" : ""}
                        {item.amount} A1N
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 md:p-8 text-center font-mono text-muted-foreground">
                NO ACTIVITY DETECTED
              </div>
            )}
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-4">
          <SectionHeader icon={History} title="Top Tools" />

          {isToolsLoading ? (
            <div className="brutalist-card p-6 text-center font-mono animate-pulse">
              ANALYZING USAGE...
            </div>
          ) : toolsUsage.length ? (
            toolsUsage.map((tool, idx) => (
              <div key={tool.toolId} className="brutalist-card p-4 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary border-[3px] flex items-center justify-center font-black">
                  {idx + 1}
                </div>

                <div className="font-black text-lg md:text-xl truncate pr-6 uppercase">
                  {tool.toolName}
                </div>

                <div className="mt-3 flex justify-between text-xs md:text-sm font-mono">
                  <div>
                    <div className="text-muted-foreground">REQUESTS</div>
                    <div className="font-bold">
                      {tool.requestCount.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-muted-foreground">TOKENS</div>
                    <div className="font-bold">
                      {tool.tokensSpent.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="brutalist-card p-6 text-center font-mono text-muted-foreground">
              NO USAGE DATA
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
      <Icon className="w-5 h-5 md:w-6 md:h-6" />
      <h2 className="text-lg md:text-2xl font-black uppercase border-b-2 pb-1">
        {title}
      </h2>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, textColor = "text-black" }: any) {
  return (
    <div className={`brutalist-card p-4 md:p-6 ${color} ${textColor} relative overflow-hidden`}>
      <Icon className="absolute -right-3 -bottom-3 w-20 h-20 md:w-32 md:h-32 opacity-20" />
      <div className="relative z-10">
        <div className="text-xs md:text-sm font-mono font-bold uppercase opacity-80">
          {title}
        </div>
        <div className="mt-1 md:mt-2 text-2xl md:text-4xl font-black">
          {value}
        </div>
      </div>
    </div>
  );
}