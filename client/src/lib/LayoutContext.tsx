import { createContext, useContext, ReactNode } from "react";

interface LayoutContextType {
  allowFAB: boolean;
  allowAssistant: boolean;
  allowThemeToggle: boolean;
}

const LayoutContext = createContext<LayoutContextType>({
  allowFAB: true,
  allowAssistant: true,
  allowThemeToggle: true,
});

export const useLayout = () => useContext(LayoutContext);

interface LayoutProviderProps {
  children: ReactNode;
  allowFAB?: boolean;
  allowAssistant?: boolean;
  allowThemeToggle?: boolean;
}

export function LayoutProvider({
  children,
  allowFAB = true,
  allowAssistant = true,
  allowThemeToggle = true,
}: LayoutProviderProps) {
  return (
    <LayoutContext.Provider value={{ allowFAB, allowAssistant, allowThemeToggle }}>
      {children}
    </LayoutContext.Provider>
  );
}