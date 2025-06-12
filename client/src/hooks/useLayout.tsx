import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutState {
  allowFAB: boolean;
  allowThemeToggle: boolean;
}

interface LayoutContextType extends LayoutState {
  setAllowFAB: (allow: boolean) => void;
  setAllowThemeToggle: (allow: boolean) => void;
  setLayoutState: (state: Partial<LayoutState>) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [allowFAB, setAllowFAB] = useState(true);
  const [allowThemeToggle, setAllowThemeToggle] = useState(true);

  const setLayoutState = (state: Partial<LayoutState>) => {
    if (state.allowFAB !== undefined) setAllowFAB(state.allowFAB);
    if (state.allowThemeToggle !== undefined) setAllowThemeToggle(state.allowThemeToggle);
  };

  return (
    <LayoutContext.Provider
      value={{
        allowFAB,
        allowThemeToggle,
        setAllowFAB,
        setAllowThemeToggle,
        setLayoutState,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}