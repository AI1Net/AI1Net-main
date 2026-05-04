import { useAccount, useConnect, useSignMessage, useBalance } from "wagmi";
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { formatEther } from "viem";

/* ================= TYPES ================= */

type Token = {
  name: string;
  address: string;
  balance: number;
  price: number;
  value: number;
};

type AlchemyBalance = {
  contractAddress: string;
  tokenBalance: string;
};

type AlchemyMetadata = {
  symbol: string;
  decimals: number;
};

/* ================= HELPERS ================= */

function short(addr?: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

/* ================= COMPONENT ================= */

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { getToken } = useAuth();

  const { data: balance } = useBalance({ address });

  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [linked, setLinked] = useState(false);

  /* ================= AUTO TOKEN FETCH ================= */

  useEffect(() => {
    if (!address) return;

    async function loadTokens() {
      try {
        setLoadingTokens(true);

        const ALCHEMY_KEY = "CBztH9pSwMzkB5jJYnStL"; // 🔴 PUT YOUR KEY

        /* ---------- 1. BALANCES ---------- */
        const res = await fetch(
          `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: 1,
              jsonrpc: "2.0",
              method: "alchemy_getTokenBalances",
              params: [address],
            }),
          }
        );

        const data = await res.json();

        const balances: AlchemyBalance[] =
          data.result?.tokenBalances || [];

        const filtered = balances.filter(
          (t) => t.tokenBalance !== "0x0"
        );

        if (!filtered.length) {
          setTokens([]);
          return;
        }

        /* ---------- 2. METADATA ---------- */
        const metaRes = await fetch(
          `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: 2,
              jsonrpc: "2.0",
              method: "alchemy_getTokenMetadata",
              params: filtered.map((t) => t.contractAddress),
            }),
          }
        );

        const metaData = await metaRes.json();
        const metaList: AlchemyMetadata[] = metaData.result || [];

        /* ---------- 3. FORMAT TOKENS ---------- */
        const tokensFormatted: Token[] = filtered.map((t, i) => {
          const m = metaList[i];

          const decimals = m?.decimals ?? 18;
          const balance =
            parseInt(t.tokenBalance, 16) / 10 ** decimals;

          return {
            name: m?.symbol || "UNKNOWN",
            address: t.contractAddress,
            balance,
            price: 0,
            value: 0,
          };
        });

        /* ---------- 4. PRICE (COINGECKO) ---------- */
        const ids = tokensFormatted
          .map((t) => t.name.toLowerCase())
          .join(",");

        let prices: Record<string, { usd: number }> = {};

        try {
          const priceRes = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
          );
          prices = await priceRes.json();
        } catch {
          console.warn("Price fetch failed");
        }

        const finalTokens: Token[] = tokensFormatted.map((t) => {
          const price = prices[t.name.toLowerCase()]?.usd || 0;

          return {
            ...t,
            price,
            value: price * t.balance,
          };
        });

        setTokens(finalTokens);
      } catch (err) {
        console.error("Token error:", err);
      } finally {
        setLoadingTokens(false);
      }
    }

    loadTokens();
  }, [address]);

  /* ================= LINK WALLET ================= */

  async function linkWallet() {
    if (!address) return;

    try {
      const nonceRes = await fetch("http://localhost:8080/api/wallet/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const { message } = await nonceRes.json();

      const signature = await signMessageAsync({ message });

      const token = await getToken();

      const verifyRes = await fetch(
        "http://localhost:8080/api/wallet/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ address, signature, message }),
        }
      );

      if (!verifyRes.ok) {
        throw new Error("Verification failed");
      }

      setLinked(true);
      alert("✅ Wallet linked");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      alert("❌ " + message);
    }
  }

  /* ================= UI ================= */

  if (!isConnected) {
    if (!connectors.length) {
      return <p>No wallet found</p>;
    }

    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        className="border-4 border-black px-6 py-3 font-black uppercase bg-primary text-black"
      >
        CONNECT WALLET
      </button>
    );
  }

  return (
    <div className="border-4 border-black p-4 bg-white text-black min-w-[240px]">
      <div className="font-mono text-xs mb-1">WALLET</div>

      <div className="font-bold text-sm">{short(address)}</div>

      {/* ETH */}
      <div className="mt-2 text-sm font-mono">
        ETH: {balance ? Number(formatEther(balance.value)).toFixed(4) : "0"}
      </div>

      {/* TOKENS */}
      <div className="mt-2 text-xs font-mono space-y-1">
        {loadingTokens ? (
          <div>LOADING TOKENS...</div>
        ) : tokens.length ? (
          tokens.map((t: Token) => (
            <div key={t.address} className="flex justify-between">
              <span>{t.name}</span>
              <span>
                {t.balance.toFixed(2)} (${t.value.toFixed(2)})
              </span>
            </div>
          ))
        ) : (
          <div>No tokens</div>
        )}
      </div>

      <button
        onClick={linkWallet}
        disabled={linked}
        className="mt-3 w-full border-2 border-black py-1 text-xs font-bold hover:bg-black hover:text-white transition disabled:opacity-50"
      >
        {linked ? "WALLET LINKED" : "LINK WALLET"}
      </button>
    </div>
  );
}