import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./features/auth/AuthContext";
import { LayoutProvider } from "./hooks/useLayout";
import { AppShell } from "./core/AppShell";
import { LanguageSelector } from "./components/LanguageSelector";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import OnboardingCandidate from "./pages/onboarding-candidate";
import OnboardingEmployer from "./pages/onboarding-employer";
import Dashboard from "./pages/dashboard";
import CreateCv from "./pages/create-cv";
import CVAssistantPage from "./pages/cv-assistant";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/onboarding/candidate" component={OnboardingCandidate} />
      <Route path="/onboarding/employer" component={OnboardingEmployer} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create-cv" component={CreateCv} />
      <Route path="/cv-assistant" component={CVAssistantPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for next tick to ensure all stores are hydrated
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LayoutProvider>
            <TooltipProvider>
              <AppShell>
                <Toaster />
                <LanguageSelector />
                <Router />
              </AppShell>
            </TooltipProvider>
          </LayoutProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
