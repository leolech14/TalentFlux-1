import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  userType?: "candidate" | "employer";
  profileData?: Record<string, any>;
  onboardingComplete: boolean;
}

interface UserProfileStore {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

const initialProfile: UserProfile = {
  onboardingComplete: false,
};

export const useUserProfile = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      setProfile: (profile) => set({ profile: { ...initialProfile, ...profile } }),
      updateProfile: (updates) => set({ profile: { ...get().profile, ...updates } }),
      clearProfile: () => set({ profile: initialProfile }),
    }),
    {
      name: "user-profile-storage",
    }
  )
);
