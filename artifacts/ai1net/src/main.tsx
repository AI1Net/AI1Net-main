import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { wagmiConfig  } from "@/lib/wagmi";

<WagmiProvider config={wagmiConfig}>
  <App />
</WagmiProvider>

createRoot(document.getElementById("root")!).render(<App />);
