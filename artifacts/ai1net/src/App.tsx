import { useEffect, useRef } from "react";
import {
  ClerkProvider,
  Show,
  useClerk,
  useAuth,
} from "@clerk/react";
import { neobrutalism } from "@clerk/themes";
import {
  Switch,
  Route,
  useLocation,
  Router as WouterRouter,
  Redirect,
} from "wouter";
import {
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { queryClient } from "@/lib/queryClient";
import { setAuthTokenGetter } from "@workspace/api-client-react";

import Home from "@/pages/home";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import Dashboard from "@/pages/dashboard";
import Explore from "@/pages/explore";
import AITool from "@/pages/ai-tool";
import Usage from "@/pages/usage";
import Rewards from "@/pages/rewards";
import Token from "@/pages/token";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

/* ================= ENV ================= */


const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const basePath = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

/* ================= HELPERS ================= */

function stripBase(path: string) {
  if (!basePath) return path;
  return path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

/* ================= CLERK UI ================= */

const clerkAppearance = {
  theme: neobrutalism,
  variables: {
    colorPrimary: "#FFD700",
    colorBackground: "#000",
    colorForeground: "#FFF",
    borderRadius: "0px",
  },
};

/* ================= ROUTE HELPERS ================= */

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>

      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

/* ================= CLERK SYNC ================= */

function ClerkQuerySync() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUser = useRef<string | null>(null);

  useEffect(() => {
    return addListener(({ user }) => {
      const current = user?.id ?? null;

      if (prevUser.current && prevUser.current !== current) {
        queryClient.clear(); // reset cache on user switch
      }

      prevUser.current = current;
    });
  }, [addListener, queryClient]);

  return null;
}

function ClerkTokenBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return null;
}

/* ================= APP CORE ================= */

function AppRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) =>
        setLocation(stripBase(to), { replace: true })
      }
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ClerkQuerySync />
          <ClerkTokenBridge />

          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />

            <Route path="/dashboard">
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </Route>

            <Route path="/explore">
              <ProtectedLayout>
                <Explore />
              </ProtectedLayout>
            </Route>

            <Route path="/ai/:slug">
              <ProtectedLayout>
                <AITool />
              </ProtectedLayout>
            </Route>

            <Route path="/usage">
              <ProtectedLayout>
                <Usage />
              </ProtectedLayout>
            </Route>

            <Route path="/rewards">
              <ProtectedLayout>
                <Rewards />
              </ProtectedLayout>
            </Route>

            <Route path="/token">
              <ProtectedLayout>
                <Token />
              </ProtectedLayout>
            </Route>

            <Route path="/settings">
              <ProtectedLayout>
                <Settings />
              </ProtectedLayout>
            </Route>

            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}


/* ================= ROOT ================= */

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <WagmiProvider config={wagmiConfig}>
        <AppRoutes />
      </WagmiProvider>
    </WouterRouter>
  );
}