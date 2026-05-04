import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected(), // MetaMask
  ],
  transports: {
    [mainnet.id]: http("https://eth.llamarpc.com"),
  },
});