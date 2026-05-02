import { 
  useListMyRewards, 
  getListMyRewardsQueryKey,
  useGetRewardsLeaderboard,
  getGetRewardsLeaderboardQueryKey
} from "@workspace/api-client-react";
import { Award, Trophy, Star, Gift, ArrowUpRight } from "lucide-react";
import { useUser } from "@clerk/react";

export default function Rewards() {
  const { user } = useUser();
  const { data: rewards, isLoading: isRewardsLoading } = useListMyRewards({
    query: { queryKey: getListMyRewardsQueryKey() }
  });
  
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useGetRewardsLeaderboard({
    query: { queryKey: getGetRewardsLeaderboardQueryKey() }
  });

  const totalRewards = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b-[4px] border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Incentives</h1>
          <p className="font-mono text-muted-foreground mt-2">EARN // COMPETE // CLIMB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 brutalist-card p-8 bg-primary text-black flex flex-col justify-center relative overflow-hidden">
          <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 opacity-20" />
          <div className="relative z-10">
            <h2 className="font-mono font-bold uppercase mb-2">TOTAL LIFETIME REWARDS</h2>
            <div className="text-6xl md:text-8xl font-black tracking-tighter filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {totalRewards.toLocaleString()} <span className="text-4xl">A1N</span>
            </div>
            <p className="mt-4 font-bold uppercase flex items-center gap-2">
              <Star className="w-5 h-5" /> Keep using network models to earn more
            </p>
          </div>
        </div>

        <div className="brutalist-card p-6 bg-card space-y-4">
          <h3 className="font-black uppercase text-xl border-b-[3px] border-black dark:border-white pb-2 flex items-center gap-2">
            <Gift className="w-5 h-5" /> Earning Paths
          </h3>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center p-2 bg-muted/50 border-2 border-black dark:border-white">
              <span className="font-bold">DAILY USAGE</span>
              <span className="text-primary-foreground bg-primary px-2 py-1 font-bold">+50 A1N</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 border-2 border-black dark:border-white">
              <span className="font-bold">BUG REPORT</span>
              <span className="text-primary-foreground bg-primary px-2 py-1 font-bold">+500 A1N</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 border-2 border-black dark:border-white">
              <span className="font-bold">NEW MODEL REQ</span>
              <span className="text-primary-foreground bg-primary px-2 py-1 font-bold">+200 A1N</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Rewards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase flex items-center gap-2 mb-4">
            <Award className="w-6 h-6" /> Reward Log
          </h2>
          <div className="brutalist-card bg-card overflow-hidden">
            {isRewardsLoading ? (
              <div className="p-8 text-center font-mono animate-pulse">FETCHING LOGS...</div>
            ) : rewards?.length ? (
              <div className="divide-y-[3px] divide-black dark:divide-white">
                {rewards.map((reward) => (
                  <div key={reward.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary border-[3px] border-black dark:border-white flex items-center justify-center font-black text-black">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold uppercase">{reward.type}</div>
                        <div className="text-xs font-mono text-muted-foreground">{new Date(reward.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="font-black text-xl text-green-600 dark:text-green-400">
                      +{reward.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center font-mono text-muted-foreground">NO REWARDS YET</div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6" /> Global Leaderboard
          </h2>
          <div className="brutalist-card bg-card overflow-hidden">
            {isLeaderboardLoading ? (
              <div className="p-8 text-center font-mono animate-pulse">LOADING STANDINGS...</div>
            ) : leaderboard?.length ? (
              <div className="divide-y-[3px] divide-black dark:divide-white">
                {leaderboard.map((entry) => {
                  const isMe = entry.userId === user?.id;
                  return (
                    <div key={entry.userId} className={`p-4 flex items-center gap-4 transition-colors ${isMe ? 'bg-primary/20' : 'hover:bg-muted/50'}`}>
                      <div className={`w-10 h-10 border-[3px] border-black dark:border-white flex items-center justify-center font-black text-lg ${
                        entry.rank === 1 ? 'bg-yellow-400 text-black' :
                        entry.rank === 2 ? 'bg-gray-300 text-black' :
                        entry.rank === 3 ? 'bg-amber-600 text-black' : 'bg-background'
                      }`}>
                        #{entry.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold uppercase flex items-center gap-2">
                          {entry.name}
                          {isMe && <span className="bg-black text-white text-[10px] px-1 py-0.5 font-mono">YOU</span>}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground">{entry.requestCount} REQUESTS</div>
                      </div>
                      <div className="font-black text-xl">
                        {entry.totalRewards.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center font-mono text-muted-foreground">LEADERBOARD UNAVAILABLE</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}