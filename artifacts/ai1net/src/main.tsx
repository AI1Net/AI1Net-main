import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";

import { setBaseUrl } from "@workspace/api-client-react";

// 🔥 IMPORTANT: API BASE FIX
setBaseUrl(import.meta.env.VITE_API_URL);

createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={wagmiConfig}>
    <App />
  </WagmiProvider>
);