"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { api, clearToken, errorMessage } from "@/lib/api";
import type { Me } from "@/lib/types";

type Status = "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthContextValue {
  status: Status;
  me: Me | null;
  error: string;
  refreshMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");
  const [loadingMe, setLoadingMe] = useState(false);

  const email = session?.user?.email;

  const loadMe = useCallback(async () => {
    setLoadingMe(true);
    setError("");
    try {
      setMe(await api<Me>("/me"));
    } catch (err) {
      setMe(null);
      setError(errorMessage(err));
    } finally {
      setLoadingMe(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!email) {
      setMe(null);
      setError("");
      setLoadingMe(false);
      return;
    }
    loadMe();
  }, [email, isPending, loadMe]);

  const logout = useCallback(async () => {
    await authClient.signOut();
    clearToken();
    setMe(null);
    toast.success("Logged out successfully");
  }, []);

  let status: Status;
  if (isPending) status = "loading";
  else if (!email) status = "unauthenticated";
  else if (me) status = "authenticated";
  else if (error) status = "error";
  else status = "loading";
  if (email && loadingMe && !me) status = "loading";

  const value = useMemo<AuthContextValue>(
    () => ({ status, me, error, refreshMe: loadMe, logout }),
    [status, me, error, loadMe, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
