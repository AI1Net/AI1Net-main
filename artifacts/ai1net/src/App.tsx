import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { neobrutalism } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/queryClient";

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

import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: neobrutalism,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#FFD700",
    colorBackground: "#000000",
    colorForeground: "#FFFFFF",
    colorInput: "#111111",
    colorInputForeground: "#FFFFFF",
    colorNeutral: "#FFFFFF",
    borderRadius: "0px",
    fontFamily: "'Space Grotesk', sans-serif",
    colorMutedForeground: "#999999",
    colorDanger: "#FF0000",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-black rounded-none w-[440px] max-w-full overflow-hidden border-[3px] border-primary shadow-[8px_8px_0px_0px_rgba(255,215,0,1)]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-white uppercase font-black text-2xl",
    headerSubtitle: "text-gray-400 font-mono text-sm",
    socialButtonsBlockButtonText: "text-white font-bold uppercase",
    formFieldLabel: "text-white font-bold uppercase",
    footerActionLink: "text-primary font-bold hover:underline",
    footerActionText: "text-gray-400",
    dividerText: "text-gray-400 font-mono",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-green-500",
    alertText: "text-red-500 font-bold",
    logoBox: "mb-6 flex justify-center",
    logoImage: "h-12 object-contain filter invert",
    socialButtonsBlockButton: "border-2 border-white rounded-none hover:bg-white hover:text-black transition-colors",
    formButtonPrimary: "bg-primary text-black border-2 border-primary rounded-none hover:bg-yellow-400 transition-colors font-black uppercase text-lg",
    formFieldInput: "bg-[#111] border-2 border-white text-white rounded-none focus:border-primary focus:ring-0 font-mono",
    footerAction: "mt-6 border-t-2 border-gray-800 pt-6",
    dividerLine: "bg-gray-800",
    alert: "border-2 border-red-500 bg-red-950/30 rounded-none",
    otpCodeFieldInput: "border-2 border-white bg-[#111] text-white rounded-none",
    formFieldRow: "mb-4",
    main: "p-8",
  },
};

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

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "ACCESS AI1NET",
            subtitle: "ENTER THE NETWORK",
          },
        },
        signUp: {
          start: {
            title: "JOIN AI1NET",
            subtitle: "INITIALIZE YOUR NODE",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            
            <Route path="/dashboard"><ProtectedLayout><Dashboard /></ProtectedLayout></Route>
            <Route path="/explore"><ProtectedLayout><Explore /></ProtectedLayout></Route>
            <Route path="/ai/:slug"><ProtectedLayout><AITool /></ProtectedLayout></Route>
            <Route path="/usage"><ProtectedLayout><Usage /></ProtectedLayout></Route>
            <Route path="/rewards"><ProtectedLayout><Rewards /></ProtectedLayout></Route>
            <Route path="/token"><ProtectedLayout><Token /></ProtectedLayout></Route>
            <Route path="/settings"><ProtectedLayout><Settings /></ProtectedLayout></Route>
            
            <Route component={NotFound} />
          </Switch>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
