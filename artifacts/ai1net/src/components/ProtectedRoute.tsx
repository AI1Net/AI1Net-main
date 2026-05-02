import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  if (!isLoaded || !isSignedIn) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-mono uppercase font-bold">Initializing Node...</div>;
  }

  return <>{children}</>;
}
