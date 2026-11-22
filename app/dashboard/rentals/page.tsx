"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import DashHeader, { TableSkeleton } from "@/components/DashHeader";
import { useAuth } from "@/components/AuthProvider";
import { EmptyState, ErrorBox, Pagination, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Booking, Paged } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

// Owner: rentals of my equipment. Admin: every rental on the platform.
function Rentals() {
  const { me } = useAuth();
  const admin = me?.role === "admin";
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<Booking> | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setData(null);
    api<Paged<Booking>>(admin ? "/admin/rentals" : "/owner/rentals", { query: { page, limit: 8 } })
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [admin, page, reload]);

  return (
    <>
      <DashHeader
        title={admin ? "All Rentals" : "Rentals of My Equipment"}
        subtitle={admin ? "Every booking made on the platform" : "Customers who booked your equipment"}
      />

      {error ? (
        <ErrorBox message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : !data ? (
        <TableSkeleton cols={7} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No rentals yet" text="Bookings will show up here once customers pay." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Customer</th>
                  {admin && <th>Owner</th>}
                  <th>Rental period</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((b) => (
                  <tr key={b._id} className="hover:bg-base-200/60">
                    <td>
                      <div className="flex items-center gap-3 font-semibold">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.equipmentImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="line-clamp-1 min-w-32">{b.equipmentName}</span>
                      </div>
                    </td>
                    <td>
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs opacity-60">{b.customerEmail}</p>
                    </td>
                    {admin && <td className="whitespace-nowrap">{b.ownerName}</td>}
                    <td className="whitespace-nowrap text-sm">
                      {fmtDate(b.startDate)} – {fmtDate(b.endDate)}
                    </td>
                    <td className="font-semibold">{money(b.amount)}</td>
                    <td><StatusBadge value={b.paymentStatus} /></td>
                    <td><StatusBadge value={b.bookingStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
}

export default function RentalsPage() {
  return (
    <RequireAuth roles={["owner", "admin"]} bare>
      <Rentals />
    </RequireAuth>
  );
}
