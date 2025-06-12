import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { AuthProvider } from "../features/auth/AuthContext";

interface FluxProviderProps {
  children: React.ReactNode;
}

export function FluxProvider({ children }: FluxProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
