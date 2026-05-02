import { useState } from "react";
import { 
  useGetTokenBalance,
  getGetTokenBalanceQueryKey,
  useListTokenTransactions,
  getListTokenTransactionsQueryKey,
  useListMyStakes,
  getListMyStakesQueryKey,
  useCreateStake,
  useListProposals,
  getListProposalsQueryKey,
  useCastVote
} from "@workspace/api-client-react";
import { Coins, Lock, Vote as VoteIcon, ArrowRight, Activity, Wallet, Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Token() {
  const [activeTab, setActiveTab] = useState<"WALLET" | "STAKING" | "GOVERNANCE">("WALLET");
  
  const { data: balance, isLoading: isBalanceLoading } = useGetTokenBalance({
    query: { queryKey: getGetTokenBalanceQueryKey() }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b-[4px] border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Ecosystem</h1>
          <p className="font-mono text-muted-foreground mt-2">TOKEN // YIELD // GOVERNANCE</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="brutalist-card bg-card p-6 border-l-[8px] border-l-primary">
          <div className="font-mono text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2"><Wallet className="w-4 h-4"/> TOTAL BALANCE</div>
          {isBalanceLoading ? <div className="h-10 w-32 bg-muted animate-pulse"/> : 
            <div className="text-4xl font-black">{balance?.balance?.toLocaleString() || 0}</div>}
        </div>
        <div className="brutalist-card bg-card p-6 border-l-[8px] border-l-secondary">
          <div className="font-mono text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> AVAILABLE (LIQUID)</div>
          {isBalanceLoading ? <div className="h-10 w-32 bg-muted animate-pulse"/> : 
            <div className="text-4xl font-black">{balance?.availableBalance?.toLocaleString() || 0}</div>}
        </div>
        <div className="brutalist-card bg-card p-6 border-l-[8px] border-l-destructive">
          <div className="font-mono text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> STAKED (LOCKED)</div>
          {isBalanceLoading ? <div className="h-10 w-32 bg-muted animate-pulse"/> : 
            <div className="text-4xl font-black">{balance?.stakedAmount?.toLocaleString() || 0}</div>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-[3px] border-black dark:border-white bg-card">
        {["WALLET", "STAKING", "GOVERNANCE"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-4 font-black uppercase tracking-wider text-sm md:text-base transition-colors border-r-[3px] last:border-r-0 border-black dark:border-white ${
              activeTab === tab 
                ? "bg-black text-white dark:bg-white dark:text-black" 
                : "hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "WALLET" && <WalletTab />}
        {activeTab === "STAKING" && <StakingTab available={balance?.availableBalance || 0} />}
        {activeTab === "GOVERNANCE" && <GovernanceTab />}
      </div>
    </div>
  );
}

function WalletTab() {
  const { data: transactions, isLoading } = useListTokenTransactions({ limit: 20 }, {
    query: { queryKey: getListTokenTransactionsQueryKey({ limit: 20 }) }
  });

  return (
    <div className="space-y-4 animate-in fade-in">
      <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2"><Coins className="w-6 h-6"/> Transaction Ledger</h2>
      <div className="brutalist-card bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center font-mono animate-pulse">SYNCING LEDGER...</div>
        ) : transactions?.data?.length ? (
          <div className="divide-y-[3px] divide-black dark:divide-white">
            {transactions.data.map(tx => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className={`px-2 py-1 font-mono text-xs font-bold border-2 border-black dark:border-white ${
                    ['EARN', 'REWARD', 'UNSTAKE'].includes(tx.type) ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                  }`}>
                    {tx.type}
                  </div>
                  <div>
                    <div className="font-bold uppercase">{tx.metadata || "SYSTEM TX"}</div>
                    <div className="text-xs font-mono text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className={`font-black text-xl ${['EARN', 'REWARD', 'UNSTAKE'].includes(tx.type) ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {['EARN', 'REWARD', 'UNSTAKE'].includes(tx.type) ? '+' : '-'}{tx.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center font-mono text-muted-foreground">NO TRANSACTIONS FOUND</div>
        )}
      </div>
    </div>
  );
}

function StakingTab({ available }: { available: number }) {
  const queryClient = useQueryClient();
  const [stakeAmount, setStakeAmount] = useState("");
  
  const { data: stakes, isLoading } = useListMyStakes({
    query: { queryKey: getListMyStakesQueryKey() }
  });
  
  const stakeMutation = useCreateStake();

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(stakeAmount);
    if (isNaN(amount) || amount <= 0 || amount > available) return;

    stakeMutation.mutate({ data: { amount } }, {
      onSuccess: () => {
        setStakeAmount("");
        queryClient.invalidateQueries({ queryKey: getListMyStakesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTokenBalanceQueryKey() });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2"><Lock className="w-6 h-6"/> Lock Tokens</h2>
        <form onSubmit={handleStake} className="brutalist-card bg-card p-6 space-y-6">
          <p className="font-mono text-sm text-muted-foreground">Stake A1N tokens to earn yield and gain voting power in protocol governance.</p>
          
          <div className="space-y-2">
            <label className="font-bold uppercase text-sm">AMOUNT TO STAKE</label>
            <div className="relative">
              <input 
                type="number" 
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0"
                max={available}
                className="w-full bg-background border-[3px] border-black dark:border-white p-4 font-mono text-xl font-bold focus:outline-none focus:border-primary focus:ring-0"
              />
              <button 
                type="button"
                onClick={() => setStakeAmount(available.toString())}
                className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-xs bg-black text-white px-2 py-1 uppercase hover:bg-primary hover:text-black transition-colors"
              >
                MAX
              </button>
            </div>
            <div className="text-right font-mono text-xs text-muted-foreground">AVAILABLE: {available} A1N</div>
          </div>

          <button 
            type="submit"
            disabled={stakeMutation.isPending || !stakeAmount || parseInt(stakeAmount) > available || parseInt(stakeAmount) <= 0}
            className="w-full brutalist-button bg-primary text-black py-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {stakeMutation.isPending ? "PROCESSING..." : "CONFIRM STAKE"} <ArrowRight className="w-5 h-5"/>
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-black uppercase mb-4">Active Stakes</h2>
        <div className="brutalist-card bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center font-mono animate-pulse">LOADING CONTRACTS...</div>
          ) : stakes?.length ? (
            <div className="divide-y-[3px] divide-black dark:divide-white">
              {stakes.map(stake => (
                <div key={stake.id} className="p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-xl">{stake.amount} A1N</span>
                    <span className={`px-2 py-1 font-mono text-xs font-bold border-2 border-black dark:border-white ${stake.status === 'ACTIVE' ? 'bg-primary text-black' : 'bg-muted'}`}>
                      {stake.status}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    LOCKED: {new Date(stake.startDate).toLocaleDateString()}
                    {stake.endDate && ` • UNLOCKS: ${new Date(stake.endDate).toLocaleDateString()}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center font-mono text-muted-foreground">NO ACTIVE STAKES</div>
          )}
        </div>
      </div>
    </div>
  );
}

function GovernanceTab() {
  const queryClient = useQueryClient();
  const { data: proposals, isLoading } = useListProposals({}, {
    query: { queryKey: getListProposalsQueryKey({}) }
  });
  
  const voteMutation = useCastVote();

  const handleVote = (proposalId: string, choice: 'YES' | 'NO' | 'ABSTAIN') => {
    voteMutation.mutate({ id: proposalId, data: { choice } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProposalsQueryKey({}) });
      }
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2"><VoteIcon className="w-6 h-6"/> Active Proposals</h2>
      
      {isLoading ? (
        <div className="brutalist-card p-8 text-center font-mono animate-pulse">SYNCING PROPOSALS...</div>
      ) : proposals?.length ? (
        <div className="grid gap-6">
          {proposals.map(prop => {
            const totalVotes = prop.yesVotes + prop.noVotes + prop.abstainVotes;
            const yesPercent = totalVotes > 0 ? Math.round((prop.yesVotes / totalVotes) * 100) : 0;
            
            return (
              <div key={prop.id} className="brutalist-card bg-card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-xl uppercase pr-4">{prop.title}</h3>
                  <span className={`shrink-0 px-2 py-1 font-mono text-xs font-bold border-2 border-black dark:border-white ${
                    prop.status === 'ACTIVE' ? 'bg-primary text-black' : 
                    prop.status === 'PASSED' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                  }`}>
                    {prop.status}
                  </span>
                </div>
                
                <p className="font-mono text-sm text-muted-foreground mb-6">{prop.description}</p>
                
                <div className="space-y-4 border-t-[3px] border-black dark:border-white pt-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                      <span>YES ({yesPercent}%)</span>
                      <span>TOTAL: {totalVotes}</span>
                    </div>
                    <div className="h-4 w-full bg-muted border-2 border-black dark:border-white overflow-hidden flex">
                      <div className="h-full bg-green-500 border-r-2 border-black dark:border-white" style={{ width: `${yesPercent}%` }} />
                      <div className="h-full bg-red-500" style={{ width: totalVotes > 0 ? `${(prop.noVotes / totalVotes) * 100}%` : '0%' }} />
                    </div>
                  </div>

                  {/* Actions */}
                  {prop.status === 'ACTIVE' && (
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => handleVote(prop.id, 'YES')}
                        disabled={!!prop.userVote || voteMutation.isPending}
                        className={`flex-1 brutalist-button py-2 text-sm ${prop.userVote === 'YES' ? 'bg-green-500 text-black border-green-500 shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-card hover:bg-green-500 hover:text-black'} disabled:opacity-50`}
                      >
                        YES
                      </button>
                      <button 
                        onClick={() => handleVote(prop.id, 'NO')}
                        disabled={!!prop.userVote || voteMutation.isPending}
                        className={`flex-1 brutalist-button py-2 text-sm ${prop.userVote === 'NO' ? 'bg-red-500 text-white border-red-500 shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-card hover:bg-red-500 hover:text-white'} disabled:opacity-50`}
                      >
                        NO
                      </button>
                      <button 
                        onClick={() => handleVote(prop.id, 'ABSTAIN')}
                        disabled={!!prop.userVote || voteMutation.isPending}
                        className={`flex-1 brutalist-button py-2 text-sm ${prop.userVote === 'ABSTAIN' ? 'bg-gray-500 text-white border-gray-500 shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-card hover:bg-gray-200'} disabled:opacity-50`}
                      >
                        ABSTAIN
                      </button>
                    </div>
                  )}
                  {prop.userVote && (
                    <div className="text-center font-mono text-xs font-bold text-primary bg-black py-2 uppercase mt-2">
                      VOTED: {prop.userVote}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="brutalist-card p-12 text-center font-mono text-muted-foreground">NO ACTIVE PROPOSALS</div>
      )}
    </div>
  );
}