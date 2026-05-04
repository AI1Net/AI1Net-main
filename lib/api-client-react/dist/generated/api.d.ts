import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AIProvider, AIRequestBody, AIRequestResponse, AITool, ActivityItem, CastVoteBody, CreateStakeBody, DashboardSummary, GetDashboardActivityParams, HealthStatus, LeaderboardEntry, ListAIToolsParams, ListMyUsageParams, ListProposalsParams, ListTokenTransactionsParams, PaginatedTransactions, PaginatedUsage, Proposal, Reward, Stake, TokenBalance, ToolUsageSummary, UpdateUserBody, UsageStats, UserProfile, Vote } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current user profile
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<UserProfile>;
export declare const getGetMeQueryKey: () => readonly ["/api/users/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<void>;
/**
 * @summary Get current user profile
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update current user profile
 */
export declare const getUpdateMeUrl: () => string;
export declare const updateMe: (updateUserBody: UpdateUserBody, options?: RequestInit) => Promise<UserProfile>;
export declare const getUpdateMeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UpdateUserBody>;
}, TContext>;
export type UpdateMeMutationResult = NonNullable<Awaited<ReturnType<typeof updateMe>>>;
export type UpdateMeMutationBody = BodyType<UpdateUserBody>;
export type UpdateMeMutationError = ErrorType<unknown>;
/**
 * @summary Update current user profile
 */
export declare const useUpdateMe: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UpdateUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UpdateUserBody>;
}, TContext>;
/**
 * @summary List all AI providers
 */
export declare const getListAIProvidersUrl: () => string;
export declare const listAIProviders: (options?: RequestInit) => Promise<AIProvider[]>;
export declare const getListAIProvidersQueryKey: () => readonly ["/api/ai/providers"];
export declare const getListAIProvidersQueryOptions: <TData = Awaited<ReturnType<typeof listAIProviders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAIProviders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAIProviders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAIProvidersQueryResult = NonNullable<Awaited<ReturnType<typeof listAIProviders>>>;
export type ListAIProvidersQueryError = ErrorType<unknown>;
/**
 * @summary List all AI providers
 */
export declare function useListAIProviders<TData = Awaited<ReturnType<typeof listAIProviders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAIProviders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List AI tools with optional filtering
 */
export declare const getListAIToolsUrl: (params?: ListAIToolsParams) => string;
export declare const listAITools: (params?: ListAIToolsParams, options?: RequestInit) => Promise<AITool[]>;
export declare const getListAIToolsQueryKey: (params?: ListAIToolsParams) => readonly ["/api/ai/tools", ...ListAIToolsParams[]];
export declare const getListAIToolsQueryOptions: <TData = Awaited<ReturnType<typeof listAITools>>, TError = ErrorType<unknown>>(params?: ListAIToolsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAITools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAITools>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAIToolsQueryResult = NonNullable<Awaited<ReturnType<typeof listAITools>>>;
export type ListAIToolsQueryError = ErrorType<unknown>;
/**
 * @summary List AI tools with optional filtering
 */
export declare function useListAITools<TData = Awaited<ReturnType<typeof listAITools>>, TError = ErrorType<unknown>>(params?: ListAIToolsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAITools>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a specific AI tool by slug
 */
export declare const getGetAIToolUrl: (slug: string) => string;
export declare const getAITool: (slug: string, options?: RequestInit) => Promise<AITool>;
export declare const getGetAIToolQueryKey: (slug: string) => readonly [`/api/ai/tools/${string}`];
export declare const getGetAIToolQueryOptions: <TData = Awaited<ReturnType<typeof getAITool>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAITool>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAITool>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAIToolQueryResult = NonNullable<Awaited<ReturnType<typeof getAITool>>>;
export type GetAIToolQueryError = ErrorType<void>;
/**
 * @summary Get a specific AI tool by slug
 */
export declare function useGetAITool<TData = Awaited<ReturnType<typeof getAITool>>, TError = ErrorType<void>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAITool>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a request to an AI tool
 */
export declare const getSubmitAIRequestUrl: () => string;
export declare const submitAIRequest: (aIRequestBody: AIRequestBody, options?: RequestInit) => Promise<AIRequestResponse>;
export declare const getSubmitAIRequestMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitAIRequest>>, TError, {
        data: BodyType<AIRequestBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitAIRequest>>, TError, {
    data: BodyType<AIRequestBody>;
}, TContext>;
export type SubmitAIRequestMutationResult = NonNullable<Awaited<ReturnType<typeof submitAIRequest>>>;
export type SubmitAIRequestMutationBody = BodyType<AIRequestBody>;
export type SubmitAIRequestMutationError = ErrorType<void>;
/**
 * @summary Submit a request to an AI tool
 */
export declare const useSubmitAIRequest: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitAIRequest>>, TError, {
        data: BodyType<AIRequestBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitAIRequest>>, TError, {
    data: BodyType<AIRequestBody>;
}, TContext>;
/**
 * @summary List current user AI usage history
 */
export declare const getListMyUsageUrl: (params?: ListMyUsageParams) => string;
export declare const listMyUsage: (params?: ListMyUsageParams, options?: RequestInit) => Promise<PaginatedUsage>;
export declare const getListMyUsageQueryKey: (params?: ListMyUsageParams) => readonly ["/api/usage", ...ListMyUsageParams[]];
export declare const getListMyUsageQueryOptions: <TData = Awaited<ReturnType<typeof listMyUsage>>, TError = ErrorType<unknown>>(params?: ListMyUsageParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyUsage>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyUsage>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyUsageQueryResult = NonNullable<Awaited<ReturnType<typeof listMyUsage>>>;
export type ListMyUsageQueryError = ErrorType<unknown>;
/**
 * @summary List current user AI usage history
 */
export declare function useListMyUsage<TData = Awaited<ReturnType<typeof listMyUsage>>, TError = ErrorType<unknown>>(params?: ListMyUsageParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyUsage>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get aggregated usage statistics for current user
 */
export declare const getGetUsageStatsUrl: () => string;
export declare const getUsageStats: (options?: RequestInit) => Promise<UsageStats>;
export declare const getGetUsageStatsQueryKey: () => readonly ["/api/usage/stats"];
export declare const getGetUsageStatsQueryOptions: <TData = Awaited<ReturnType<typeof getUsageStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsageStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUsageStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUsageStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getUsageStats>>>;
export type GetUsageStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get aggregated usage statistics for current user
 */
export declare function useGetUsageStats<TData = Awaited<ReturnType<typeof getUsageStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsageStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current user token balance
 */
export declare const getGetTokenBalanceUrl: () => string;
export declare const getTokenBalance: (options?: RequestInit) => Promise<TokenBalance>;
export declare const getGetTokenBalanceQueryKey: () => readonly ["/api/tokens/balance"];
export declare const getGetTokenBalanceQueryOptions: <TData = Awaited<ReturnType<typeof getTokenBalance>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTokenBalance>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTokenBalance>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTokenBalanceQueryResult = NonNullable<Awaited<ReturnType<typeof getTokenBalance>>>;
export type GetTokenBalanceQueryError = ErrorType<unknown>;
/**
 * @summary Get current user token balance
 */
export declare function useGetTokenBalance<TData = Awaited<ReturnType<typeof getTokenBalance>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTokenBalance>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List token transaction history
 */
export declare const getListTokenTransactionsUrl: (params?: ListTokenTransactionsParams) => string;
export declare const listTokenTransactions: (params?: ListTokenTransactionsParams, options?: RequestInit) => Promise<PaginatedTransactions>;
export declare const getListTokenTransactionsQueryKey: (params?: ListTokenTransactionsParams) => readonly ["/api/tokens/transactions", ...ListTokenTransactionsParams[]];
export declare const getListTokenTransactionsQueryOptions: <TData = Awaited<ReturnType<typeof listTokenTransactions>>, TError = ErrorType<unknown>>(params?: ListTokenTransactionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTokenTransactions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTokenTransactions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTokenTransactionsQueryResult = NonNullable<Awaited<ReturnType<typeof listTokenTransactions>>>;
export type ListTokenTransactionsQueryError = ErrorType<unknown>;
/**
 * @summary List token transaction history
 */
export declare function useListTokenTransactions<TData = Awaited<ReturnType<typeof listTokenTransactions>>, TError = ErrorType<unknown>>(params?: ListTokenTransactionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTokenTransactions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List current user rewards
 */
export declare const getListMyRewardsUrl: () => string;
export declare const listMyRewards: (options?: RequestInit) => Promise<Reward[]>;
export declare const getListMyRewardsQueryKey: () => readonly ["/api/rewards"];
export declare const getListMyRewardsQueryOptions: <TData = Awaited<ReturnType<typeof listMyRewards>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyRewards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyRewards>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyRewardsQueryResult = NonNullable<Awaited<ReturnType<typeof listMyRewards>>>;
export type ListMyRewardsQueryError = ErrorType<unknown>;
/**
 * @summary List current user rewards
 */
export declare function useListMyRewards<TData = Awaited<ReturnType<typeof listMyRewards>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyRewards>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get rewards leaderboard
 */
export declare const getGetRewardsLeaderboardUrl: () => string;
export declare const getRewardsLeaderboard: (options?: RequestInit) => Promise<LeaderboardEntry[]>;
export declare const getGetRewardsLeaderboardQueryKey: () => readonly ["/api/rewards/leaderboard"];
export declare const getGetRewardsLeaderboardQueryOptions: <TData = Awaited<ReturnType<typeof getRewardsLeaderboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRewardsLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRewardsLeaderboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRewardsLeaderboardQueryResult = NonNullable<Awaited<ReturnType<typeof getRewardsLeaderboard>>>;
export type GetRewardsLeaderboardQueryError = ErrorType<unknown>;
/**
 * @summary Get rewards leaderboard
 */
export declare function useGetRewardsLeaderboard<TData = Awaited<ReturnType<typeof getRewardsLeaderboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRewardsLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List current user stakes
 */
export declare const getListMyStakesUrl: () => string;
export declare const listMyStakes: (options?: RequestInit) => Promise<Stake[]>;
export declare const getListMyStakesQueryKey: () => readonly ["/api/stakes"];
export declare const getListMyStakesQueryOptions: <TData = Awaited<ReturnType<typeof listMyStakes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyStakes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyStakes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyStakesQueryResult = NonNullable<Awaited<ReturnType<typeof listMyStakes>>>;
export type ListMyStakesQueryError = ErrorType<unknown>;
/**
 * @summary List current user stakes
 */
export declare function useListMyStakes<TData = Awaited<ReturnType<typeof listMyStakes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyStakes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Stake tokens
 */
export declare const getCreateStakeUrl: () => string;
export declare const createStake: (createStakeBody: CreateStakeBody, options?: RequestInit) => Promise<Stake>;
export declare const getCreateStakeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStake>>, TError, {
        data: BodyType<CreateStakeBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createStake>>, TError, {
    data: BodyType<CreateStakeBody>;
}, TContext>;
export type CreateStakeMutationResult = NonNullable<Awaited<ReturnType<typeof createStake>>>;
export type CreateStakeMutationBody = BodyType<CreateStakeBody>;
export type CreateStakeMutationError = ErrorType<unknown>;
/**
 * @summary Stake tokens
 */
export declare const useCreateStake: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStake>>, TError, {
        data: BodyType<CreateStakeBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createStake>>, TError, {
    data: BodyType<CreateStakeBody>;
}, TContext>;
/**
 * @summary List governance proposals
 */
export declare const getListProposalsUrl: (params?: ListProposalsParams) => string;
export declare const listProposals: (params?: ListProposalsParams, options?: RequestInit) => Promise<Proposal[]>;
export declare const getListProposalsQueryKey: (params?: ListProposalsParams) => readonly ["/api/governance/proposals", ...ListProposalsParams[]];
export declare const getListProposalsQueryOptions: <TData = Awaited<ReturnType<typeof listProposals>>, TError = ErrorType<unknown>>(params?: ListProposalsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProposals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProposals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProposalsQueryResult = NonNullable<Awaited<ReturnType<typeof listProposals>>>;
export type ListProposalsQueryError = ErrorType<unknown>;
/**
 * @summary List governance proposals
 */
export declare function useListProposals<TData = Awaited<ReturnType<typeof listProposals>>, TError = ErrorType<unknown>>(params?: ListProposalsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProposals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Cast a vote on a proposal
 */
export declare const getCastVoteUrl: (id: string) => string;
export declare const castVote: (id: string, castVoteBody: CastVoteBody, options?: RequestInit) => Promise<Vote>;
export declare const getCastVoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof castVote>>, TError, {
        id: string;
        data: BodyType<CastVoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof castVote>>, TError, {
    id: string;
    data: BodyType<CastVoteBody>;
}, TContext>;
export type CastVoteMutationResult = NonNullable<Awaited<ReturnType<typeof castVote>>>;
export type CastVoteMutationBody = BodyType<CastVoteBody>;
export type CastVoteMutationError = ErrorType<unknown>;
/**
 * @summary Cast a vote on a proposal
 */
export declare const useCastVote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof castVote>>, TError, {
        id: string;
        data: BodyType<CastVoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof castVote>>, TError, {
    id: string;
    data: BodyType<CastVoteBody>;
}, TContext>;
/**
 * @summary Get dashboard summary stats for current user
 */
export declare const getGetDashboardSummaryUrl: () => string;
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/dashboard/summary"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary stats for current user
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recent activity feed for current user
 */
export declare const getGetDashboardActivityUrl: (params?: GetDashboardActivityParams) => string;
export declare const getDashboardActivity: (params?: GetDashboardActivityParams, options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getGetDashboardActivityQueryKey: (params?: GetDashboardActivityParams) => readonly ["/api/dashboard/activity", ...GetDashboardActivityParams[]];
export declare const getGetDashboardActivityQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardActivity>>, TError = ErrorType<unknown>>(params?: GetDashboardActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardActivity>>>;
export type GetDashboardActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent activity feed for current user
 */
export declare function useGetDashboardActivity<TData = Awaited<ReturnType<typeof getDashboardActivity>>, TError = ErrorType<unknown>>(params?: GetDashboardActivityParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get per-tool usage counts for current user
 */
export declare const getGetToolsUsageSummaryUrl: () => string;
export declare const getToolsUsageSummary: (options?: RequestInit) => Promise<ToolUsageSummary[]>;
export declare const getGetToolsUsageSummaryQueryKey: () => readonly ["/api/dashboard/tools-usage"];
export declare const getGetToolsUsageSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getToolsUsageSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getToolsUsageSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getToolsUsageSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetToolsUsageSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getToolsUsageSummary>>>;
export type GetToolsUsageSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Get per-tool usage counts for current user
 */
export declare function useGetToolsUsageSummary<TData = Awaited<ReturnType<typeof getToolsUsageSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getToolsUsageSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map