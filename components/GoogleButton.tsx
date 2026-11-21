"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function GoogleButton({ next = "/", label = "Continue with Google" }: { next?: string; label?: string }) {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      // Google sign-ups get the Customer role by default
      await authClient.signIn.social({ provider: "google", callbackURL: next });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={onClick} disabled={busy} className="btn btn-outline w-full">
      {busy ? <span className="loading loading-spinner loading-sm" /> : <FcGoogle className="h-5 w-5" />}
      {label}
    </button>
  );
}
