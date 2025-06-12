import { create } from 'zustand';

interface UIState {
  assistantOpen: boolean;
  sidebarOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  closeAll: () => void;
}

export const useUIState = create<UIState>((set) => ({
  assistantOpen: false,
  sidebarOpen: false,
  setAssistantOpen: (open) => set({ assistantOpen: open }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  closeAll: () => set({ assistantOpen: false, sidebarOpen: false }),
}));