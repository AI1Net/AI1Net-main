import { useAccount, useConnect, useSignMessage } from "wagmi";
import { useAuth } from "@clerk/react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { getToken, userId } = useAuth();

  async function handleConnect() {
    if (!address) return;

    // 1. get nonce message
    const res = await fetch("http://localhost:8080/api/wallet/nonce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    const { message } = await res.json();

    // 2. sign message
    const signature = await signMessageAsync({ message });

    // 3. send to backend
    const token = await getToken();

    await fetch("http://localhost:8080/api/wallet/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address,
        signature,
        message,
        clerkId: userId,
      }),
    });

    alert("Wallet linked!");
  }

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        className="border-4 border-black px-6 py-3 font-black uppercase bg-primary text-black hover:translate-x-[2px] hover:translate-y-[2px] transition"
      >
        CONNECT WALLET
      </button>
    );
  }

  return (
    <div>
      <p>{address}</p>
      <button onClick={handleConnect}>Link Wallet</button>
    </div>
  );
}