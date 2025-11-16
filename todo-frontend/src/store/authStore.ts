import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { id: string; email: string; name?: string } | null;

type State = {
    token: string | null;
    user: User;
    setAuth: (token: string, user: User) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<State>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: (token, user) => set({ token, user }),
            clearAuth: () => set({ token: null, user: null }),
        }),
        { name: "todo-auth" }
    )
);

export const getAuthToken = () => {
    try {
        return useAuthStore.getState().token;
    } catch {
        return null;
    }
};