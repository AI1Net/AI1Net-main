import { useState } from "react";
import { 
  useListMyUsage, 
  getListMyUsageQueryKey,
  useGetUsageStats,
  getGetUsageStatsQueryKey,
  UsageStatus
} from "@workspace/api-client-react";
import { Activity, CheckCircle, XCircle, Clock, Zap, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Usage() {
  const [statusFilter, setStatusFilter] = useState<UsageStatus | undefined>(undefined);

  const { data: stats, isLoading: isStatsLoading } = useGetUsageStats({
    query: { queryKey: getGetUsageStatsQueryKey() }
  });

  const { data: usage, isLoading: isUsageLoading } = useListMyUsage(
    { limit: 50, status: statusFilter },
    { query: { queryKey: getListMyUsageQueryKey({ limit: 50, status: statusFilter }) } }
  );

  const chartData = stats?.topCategories?.map(item => ({
    name: item.category,
    count: item.count
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b-[4px] border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Telemetry</h1>
          <p className="font-mono text-muted-foreground mt-2">USAGE_STATS // REQUEST_LOGS</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Requests" 
          value={stats?.totalRequests?.toLocaleString() || "0"} 
          icon={Activity} 
          isLoading={isStatsLoading}
        />
        <StatCard 
          title="Tokens Spent" 
          value={stats?.totalTokensSpent?.toLocaleString() || "0"} 
          icon={Zap} 
          isLoading={isStatsLoading}
        />
        <StatCard 
          title="Success Rate" 
          value={`${stats?.successRate || 0}%`} 
          icon={Target} 
          isLoading={isStatsLoading}
        />
        <StatCard 
          title="Today's Cost" 
          value={stats?.tokensSpentToday?.toLocaleString() || "0"} 
          icon={Clock} 
          isLoading={isStatsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logs Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black uppercase">Execution Logs</h2>
            <select 
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value ? e.target.value as UsageStatus : undefined)}
              className="brutalist-border bg-card p-2 font-mono font-bold text-sm uppercase focus:outline-none"
            >
              <option value="">ALL STATUS</option>
              {Object.values(UsageStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="brutalist-card bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-sm text-left">
                <thead className="bg-muted border-b-[3px] border-black dark:border-white text-muted-foreground uppercase">
                  <tr>
                    <th className="p-4 font-bold">STATUS</th>
                    <th className="p-4 font-bold">TOOL</th>
                    <th className="p-4 font-bold">CATEGORY</th>
                    <th className="p-4 font-bold">TOKENS</th>
                    <th className="p-4 font-bold">TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y-[2px] divide-black/20 dark:divide-white/20">
                  {isUsageLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center animate-pulse">LOADING LOGS...</td></tr>
                  ) : usage?.data?.length ? (
                    usage.data.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          {log.status === 'SUCCESS' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           log.status === 'FAILED' ? <XCircle className="w-5 h-5 text-red-600" /> :
                           <Clock className="w-5 h-5 text-yellow-600" />}
                        </td>
                        <td className="p-4 font-bold uppercase">{log.toolName}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-black text-white text-xs">{log.category}</span>
                        </td>
                        <td className="p-4 font-bold">{log.tokensUsed} A1N</td>
                        <td className="p-4 text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">NO LOGS FOUND</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase mb-4">Category Dist</h2>
          <div className="brutalist-card p-6 bg-card h-[400px]">
            {isStatsLoading ? (
              <div className="w-full h-full flex items-center justify-center font-mono animate-pulse">RENDERING CHART...</div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#000', color: '#fff', border: '2px solid #FFD700', borderRadius: '0px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FFD700' : '#0066FF'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-muted-foreground">NO DATA</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, isLoading }: { title: string, value: string, icon: any, isLoading: boolean }) {
  return (
    <div className="brutalist-card p-6 bg-card relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="font-mono text-sm font-bold text-muted-foreground uppercase">{title}</div>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      {isLoading ? (
        <div className="h-10 w-1/2 bg-muted animate-pulse"></div>
      ) : (
        <div className="text-4xl font-black tracking-tighter">{value}</div>
      )}
    </div>
  );
}