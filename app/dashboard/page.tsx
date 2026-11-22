"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

// Sends each role to its first dashboard page
const home = {
  customer: "/dashboard/my-rentals",
  owner: "/dashboard/analytics",
  admin: "/dashboard/analytics",
} as const;

export default function DashboardIndex() {
  const { me } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (me) router.replace(home[me.role]);
  }, [me, router]);

  return <div className="skeleton h-64 w-full" />;
}
