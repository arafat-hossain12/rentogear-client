import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="RentoGear home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary">
        <svg viewBox="0 0 64 64" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" style={{ color: "var(--color-accent)" }}>
          <circle cx="32" cy="32" r="10" />
          <path d="M32 10v8M32 46v8M10 32h8M46 32h8M16.5 16.5l5.7 5.7M41.8 41.8l5.7 5.7M16.5 47.5l5.7-5.7M41.8 22.2l5.7-5.7" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        Rento<span className="text-primary">Gear</span>
      </span>
    </Link>
  );
}
