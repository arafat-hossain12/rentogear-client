"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import RequireAuth from "@/components/RequireAuth";
import { ErrorBox } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

function Confirm() {
  const sessionId = useSearchParams().get("session_id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!sessionId) {
      setError("No payment session found.");
      return;
    }
    // The server checks the payment with Stripe, marks the booking paid and records the transaction
    api<Booking>("/bookings/confirm", { method: "POST", body: { sessionId } })
      .then(setBooking)
      .catch((err) => setError(errorMessage(err)));
  }, [sessionId]);

  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorBox message={error} />
        <div className="mt-6 text-center">
          <Link href="/dashboard/my-rentals" className="btn btn-primary">Go to My Rentals</Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-lg space-y-4">
          <div className="skeleton h-16 w-16 rounded-full" />
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  const rows: [string, string][] = [
    ["Equipment", booking.equipmentName],
    ["Rental period", `${fmtDate(booking.startDate)} - ${fmtDate(booking.endDate)}`],
    ["Quantity", String(booking.quantity)],
    ["Amount paid", money(booking.amount)],
    ["Booking status", booking.bookingStatus],
  ];

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-lg rounded-box border border-base-300 bg-base-100 p-8 text-center shadow-lg">
        <FiCheckCircle className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-3xl font-extrabold">Payment successful</h1>
        <p className="mt-2 opacity-70">Your booking is confirmed. The owner has been notified.</p>

        <dl className="mt-6 divide-y divide-base-300 rounded-xl border border-base-300 text-left text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 p-3">
              <dt className="opacity-70">{k}</dt>
              <dd className="font-semibold capitalize">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/my-rentals" className="btn btn-primary">View my rentals</Link>
          <Link href="/equipment" className="btn btn-outline">Keep browsing</Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <RequireAuth roles={["customer"]}>
      <Suspense fallback={<div className="container-page py-16"><div className="skeleton h-64 w-full" /></div>}>
        <Confirm />
      </Suspense>
    </RequireAuth>
  );
}
