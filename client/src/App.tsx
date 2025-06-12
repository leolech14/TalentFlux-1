import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./features/auth/AuthContext";
import { LayoutProvider } from "./lib/LayoutContext";
import { AppShell } from "./core/AppShell";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import OnboardingCandidate from "./pages/onboarding-candidate";
import OnboardingEmployer from "./pages/onboarding-employer";
import Dashboard from "./pages/dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => (
          <LayoutProvider allowFAB={false} allowAssistant={false} allowThemeToggle={false}>
            <Landing />
          </LayoutProvider>
        )}
      </Route>
      <Route path="/login">
        {() => (
          <LayoutProvider allowFAB={false} allowAssistant={false} allowThemeToggle={false}>
            <Login />
          </LayoutProvider>
        )}
      </Route>
      <Route path="/onboarding">
        {() => (
          <LayoutProvider allowFAB={false} allowAssistant={false} allowThemeToggle={false}>
            <Onboarding />
          </LayoutProvider>
        )}
      </Route>
      <Route path="/onboarding/candidate">
        {() => (
          <LayoutProvider allowFAB={false} allowAssistant={false} allowThemeToggle={false}>
            <OnboardingCandidate />
          </LayoutProvider>
        )}
      </Route>
      <Route path="/onboarding/employer">
        {() => (
          <LayoutProvider allowFAB={false} allowAssistant={false} allowThemeToggle={false}>
            <OnboardingEmployer />
          </LayoutProvider>
        )}
      </Route>
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppShell>
            <Toaster />
            <Router />
          </AppShell>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
