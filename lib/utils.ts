import type { RentalType } from "./types";

export const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function fmtDate(value: string | Date | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

export const todayISO = () => new Date().toISOString().slice(0, 10);

// Same formula as the server: price x rental units x quantity
export function calcRental(price: number, rentalType: RentalType, start: string, end: string, quantity: number) {
  const s = new Date(`${start}T00:00:00Z`).getTime();
  const e = new Date(`${end}T00:00:00Z`).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return { days: 0, units: 0, amount: 0 };
  const days = Math.round((e - s) / 86400000) + 1;
  let units = days;
  if (rentalType === "weekly") units = Math.ceil(days / 7);
  if (rentalType === "monthly") units = Math.ceil(days / 30);
  return { days, units, amount: Math.round(price * units * quantity * 100) / 100 };
}

export const rentalLabel: Record<RentalType, string> = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

// Password rule from the assignment: uppercase + lowercase + at least 6 characters
export function passwordProblem(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  return null;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Uploads an image to imgbb and returns the direct link
export async function uploadToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not configured. Paste an image link instead.");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: form });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.data?.url) throw new Error("Image upload failed. Please try again.");
  return data.data.url as string;
}

export const canUpload = () => Boolean(process.env.NEXT_PUBLIC_IMGBB_KEY);
