"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthShell from "@/components/AuthShell";
import GoogleButton from "@/components/GoogleButton";
import { useAuth } from "@/components/AuthProvider";
import { authClient } from "@/lib/auth-client";
import { isEmail } from "@/lib/utils";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { status } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace(next);
  }, [status, router, next]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email.trim())) return void toast.error("Please enter a valid email address");
    if (!password) return void toast.error("Please enter your password");

    setBusy(true);
    const { error } = await authClient.signIn.email({ email: email.trim(), password });
    setBusy(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success("Welcome back! You are logged in.");
    router.replace(next);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to book equipment or manage your listings">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <label className="form-control block">
          <span className="mb-1 block text-sm font-semibold">Email</span>
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="form-control block">
          <span className="mb-1 block text-sm font-semibold">Password</span>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              className="input input-bordered w-full pr-11"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />} Login
        </button>
      </form>

      <div className="divider my-5 text-xs">OR</div>
      <GoogleButton next={next} />

      <p className="mt-6 text-center text-sm">
        New to RentoGear?{" "}
        <Link href="/register" className="font-bold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="skeleton mx-auto my-20 h-96 w-full max-w-md" />}>
      <LoginForm />
    </Suspense>
  );
}
