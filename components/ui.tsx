"use client";

import { FaRegStar, FaStar } from "react-icons/fa6";
import { FiAlertCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 leading-relaxed opacity-70">{subtitle}</p>}
    </div>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 text-accent" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (i <= value ? <FaStar key={i} /> : <FaRegStar key={i} />))}
    </div>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-box border border-base-300 bg-base-100 p-8 text-center">
      <FiAlertCircle className="mb-3 h-8 w-8 text-error" />
      <p className="text-sm opacity-80">{message}</p>
      {onRetry && (
        <button className="btn btn-primary btn-sm mt-4" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-box border border-dashed border-base-300 p-10 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="mt-2 text-sm opacity-70">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;

  const numbers: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) numbers.push(i);
    else if (numbers[numbers.length - 1] !== "…") numbers.push("…");
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
      <button className="btn btn-sm btn-ghost" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <FiChevronLeft />
      </button>
      {numbers.map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className="px-2 opacity-50">…</span>
        ) : (
          <button
            key={n}
            className={`btn btn-sm ${n === page ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        )
      )}
      <button className="btn btn-sm btn-ghost" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <FiChevronRight />
      </button>
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    approved: "badge-success",
    paid: "badge-success",
    confirmed: "badge-success",
    completed: "badge-info",
    pending: "badge-warning",
    unpaid: "badge-warning",
    rejected: "badge-error",
    cancelled: "badge-error",
  };
  return <span className={`badge badge-soft capitalize ${map[value] || "badge-neutral"}`}>{value}</span>;
}
