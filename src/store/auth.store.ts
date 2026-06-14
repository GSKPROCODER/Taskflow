import { create } from "zustand";
import type { User } from "@/types";

// Auth session state (PRD §9). Server state lives in TanStack Query; this holds
// the current user/session for the UI.
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
