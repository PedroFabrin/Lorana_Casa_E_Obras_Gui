import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { User } from "@/lib/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

async function fetchUserByEmail(token: string, email: string): Promise<User | null> {
  const { data } = await axios.post(
    `${API_URL}/users/list`,
    { email },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const list = data.data.data as User[];
  return list[0] ?? null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      async login(email, password) {
        set({ isLoading: true });
        try {
          const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
          const token = data.data.access_token as string;
          const user = await fetchUserByEmail(token, email);
          set({ token, user });
        } finally {
          set({ isLoading: false });
        }
      },
      logout() {
        set({ token: null, user: null });
      },
      async signOut() {
        const { token } = get();
        try {
          if (token) {
            await axios.post(`${API_URL}/auth/logout`, null, { headers: { Authorization: `Bearer ${token}` } });
          }
        } catch {
          // o token local é descartado mesmo se o servidor não responder
        } finally {
          set({ token: null, user: null });
        }
      },
      async refreshMe() {
        const { token, user } = get();
        if (!token || !user) return;
        const fresh = await fetchUserByEmail(token, user.email);
        if (fresh) set({ user: fresh });
      },
    }),
    { name: "lorana-auth" },
  ),
);
