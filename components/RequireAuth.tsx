"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import type { Role } from "@/lib/types";

export function PageSkeleton() {
  return (
    <div className="container-page py-10">
      <div className="skeleton mb-6 h-8 w-64" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="skeleton h-40" />
        <div className="skeleton h-40" />
        <div className="skeleton h-40" />
      </div>
    </div>
  );
}

// Waits for the session to load before deciding, so a reload on a private
// route never bounces a logged-in user to the login page.
export default function RequireAuth({
  roles,
  children,
  bare = false,
}: {
  roles?: Role[];
  children: React.ReactNode;
  bare?: boolean;
}) {
  const { status, me, error, refreshMe } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status === "loading" || status === "unauthenticated") {
    return bare ? <div className="skeleton h-40 w-full" /> : <PageSkeleton />;
  }

  if (status === "error") {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-box border border-base-300 bg-base-100 p-8 text-center">
          <h2 className="text-xl font-bold">Could not load your account</h2>
          <p className="mt-2 text-sm opacity-70">{error}</p>
          <button className="btn btn-primary mt-5" onClick={() => refreshMe()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (roles && me && !roles.includes(me.role)) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-box border border-base-300 bg-base-100 p-8 text-center">
          <h2 className="text-xl font-bold">Access denied</h2>
          <p className="mt-2 text-sm opacity-70">
            This page is only available to {roles.join(" / ")} accounts.
          </p>
          <Link href="/dashboard" className="btn btn-primary mt-5">
            Go to my dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
