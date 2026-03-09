"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User, UserRole } from "@/shared/types";
import { setTrpcUserId } from "@/shared/trpc/auth-header";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithUser: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, User> = {
  "cliente@email.com": {
    id: "mock-1",
    name: "João Silva",
    email: "cliente@email.com",
    role: "client",
    company: "Tech Corp",
    createdAt: new Date(),
  },
  "dev@email.com": {
    id: "mock-2",
    name: "Maria Santos",
    email: "dev@email.com",
    role: "developer",
    createdAt: new Date(),
  },
  "admin@email.com": {
    id: "mock-3",
    name: "Carlos Admin",
    email: "admin@email.com",
    role: "admin",
    createdAt: new Date(),
  },
};

const AUTH_STORAGE_KEY = "kanban_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setTrpcUserId(user?.id ?? null);
  }, [user]);

  const login = useCallback(async (email: string, _password: string) => {
    const mockUser = MOCK_USERS[email];
    if (mockUser) {
      setUser(mockUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      return true;
    }
    return false;
  }, []);

  const loginWithUser = useCallback((user: User) => {
    setUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (prev) {
        const updatedUser = { ...prev, role };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithUser,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
