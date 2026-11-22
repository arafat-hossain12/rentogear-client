"use client";

import { useEffect, useState } from "react";
import { FiBox, FiCheckCircle, FiClock, FiDollarSign, FiShoppingBag, FiUsers } from "react-icons/fi";
import RequireAuth from "@/components/RequireAuth";
import DashHeader from "@/components/DashHeader";
import { useAuth } from "@/components/AuthProvider";
import { ErrorBox } from "@/components/ui";
import { ChartCard, DonutChart, MonthlyBarChart, MonthlyLineChart, StatCard } from "@/components/charts";
import { api, errorMessage } from "@/lib/api";
import { money } from "@/lib/utils";

interface AdminData {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  pendingApprovals: number;
  completedRentals: number;
  totalRevenue: number;
  monthly: { month: string; bookings: number; revenue: number }[];
  equipmentByCategory: { name: string; count: number }[];
  usersByRole: { role: string; count: number }[];
}

interface OwnerData {
  totalEquipment: number;
  approvedEquipment: number;
  totalBookings: number;
  completedRentals: number;
  totalEarnings: number;
  monthly: { month: string; bookings: number; earnings: number }[];
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="skeleton h-80" />
        <div className="skeleton h-80" />
      </div>
    </div>
  );
}

function AdminAnalytics() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setError("");
    setData(null);
    api<AdminData>("/admin/analytics")
      .then(setData)
      .catch((e) => setError(errorMessage(e)));
  }, [reload]);

  if (error) return <ErrorBox message={error} onRetry={() => setReload((n) => n + 1)} />;
  if (!data) return <Skeleton />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total users" value={data.totalUsers} icon={FiUsers} />
        <StatCard label="Total equipment" value={data.totalEquipment} icon={FiBox} tone="info" />
        <StatCard label="Total bookings (paid)" value={data.totalBookings} icon={FiShoppingBag} tone="accent" />
        <StatCard label="Pending approvals" value={data.pendingApprovals} icon={FiClock} tone="warning" />
        <StatCard label="Completed rentals" value={data.completedRentals} icon={FiCheckCircle} tone="success" />
        <StatCard label="Total revenue" value={money(data.totalRevenue)} icon={FiDollarSign} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Bookings per month">
          <MonthlyBarChart data={data.monthly} dataKey="bookings" name="Bookings" />
        </ChartCard>
        <ChartCard title="Revenue per month">
          <MonthlyLineChart data={data.monthly} dataKey="revenue" name="Revenue" money />
        </ChartCard>
        <ChartCard title="Equipment by category">
          <DonutChart data={data.equipmentByCategory.map((c) => ({ name: c.name, value: c.count }))} />
        </ChartCard>
        <ChartCard title="Users by role">
          <DonutChart data={data.usersByRole.map((r) => ({ name: r.role, value: r.count }))} />
        </ChartCard>
      </div>
    </div>
  );
}

function OwnerAnalytics() {
  const [data, setData] = useState<OwnerData | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setError("");
    setData(null);
    api<OwnerData>("/owner/analytics")
      .then(setData)
      .catch((e) => setError(errorMessage(e)));
  }, [reload]);

  if (error) return <ErrorBox message={error} onRetry={() => setReload((n) => n + 1)} />;
  if (!data) return <Skeleton />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="My equipment" value={data.totalEquipment} icon={FiBox} />
        <StatCard label="Approved listings" value={data.approvedEquipment} icon={FiCheckCircle} tone="success" />
        <StatCard label="Total bookings (paid)" value={data.totalBookings} icon={FiShoppingBag} tone="accent" />
        <StatCard label="Completed rentals" value={data.completedRentals} icon={FiCheckCircle} tone="info" />
        <StatCard label="Total earnings" value={money(data.totalEarnings)} icon={FiDollarSign} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Bookings per month">
          <MonthlyBarChart data={data.monthly} dataKey="bookings" name="Bookings" />
        </ChartCard>
        <ChartCard title="Earnings per month">
          <MonthlyLineChart data={data.monthly} dataKey="earnings" name="Earnings" money />
        </ChartCard>
      </div>
    </div>
  );
}

function Analytics() {
  const { me } = useAuth();
  return (
    <>
      <DashHeader
        title={me?.role === "admin" ? "Platform Analytics" : "My Analytics"}
        subtitle={me?.role === "admin" ? "Overview of the whole marketplace" : "How your equipment is performing"}
      />
      {me?.role === "admin" ? <AdminAnalytics /> : <OwnerAnalytics />}
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <RequireAuth roles={["owner", "admin"]} bare>
      <Analytics />
    </RequireAuth>
  );
}
