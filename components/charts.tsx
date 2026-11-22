"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import type { IconType } from "react-icons";

const tooltipStyle = {
  background: "var(--color-base-100)",
  border: "1px solid var(--color-base-300)",
  borderRadius: 10,
  fontSize: 13,
};

export const PIE_COLORS = ["#0f766e", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#14b8a6"];

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  icon: IconType;
  tone?: "primary" | "accent" | "info" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    info: "bg-info/10 text-info",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
  };
  return (
    <div className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5">
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium opacity-70">{label}</p>
        <p className="truncate text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-5">
      <h3 className="mb-4 font-bold">{title}</h3>
      <div className="h-72 w-full">{children}</div>
    </div>
  );
}

const monthLabel = (m: string) => {
  const [y, mo] = m.split("-").map(Number);
  return new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
};

export function MonthlyBarChart({
  data,
  dataKey,
  name,
  money,
}: {
  data: { month: string; [k: string]: number | string }[];
  dataKey: string;
  name: string;
  money?: boolean;
}) {
  const rows = data.map((d) => ({ ...d, label: monthLabel(d.month) }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} allowDecimals={false} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => (money ? `$${Number(v).toLocaleString()}` : String(v))}
        />
        <Bar dataKey={dataKey} name={name} fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyLineChart({
  data,
  dataKey,
  name,
  money,
}: {
  data: { month: string; [k: string]: number | string }[];
  dataKey: string;
  name: string;
  money?: boolean;
}) {
  const rows = data.map((d) => ({ ...d, label: monthLabel(d.month) }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
        <YAxis tick={{ fontSize: 12 }} stroke="currentColor" opacity={0.6} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => (money ? `$${Number(v).toLocaleString()}` : String(v))}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke="var(--color-accent)"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
