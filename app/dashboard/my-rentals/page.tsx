"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import DashHeader, { TableSkeleton } from "@/components/DashHeader";
import { EmptyState, ErrorBox, Pagination, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Booking, Paged } from "@/lib/types";
import { fmtDate, money } from "@/lib/utils";

function MyRentals() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<Booking> | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setData(null);
    api<Paged<Booking>>("/bookings/mine", { query: { page, limit: 8 } })
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [page, reload]);

  return (
    <>
      <DashHeader title="My Rentals" subtitle="All your equipment bookings" />

      {error ? (
        <ErrorBox message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : !data ? (
        <TableSkeleton cols={7} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No rentals yet"
          text="When you book equipment, it will show up here."
          action={<Link href="/equipment" className="btn btn-primary btn-sm">Browse equipment</Link>}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Start date</th>
                  <th>End date</th>
                  <th>Booking date</th>
                  <th>Total amount</th>
                  <th>Payment</th>
                  <th>Booking status</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((b) => (
                  <tr key={b._id} className="hover:bg-base-200/60">
                    <td>
                      <Link href={`/equipment/${b.equipmentId}`} className="flex items-center gap-3 font-semibold hover:text-primary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.equipmentImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="line-clamp-1 min-w-32">{b.equipmentName}</span>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap">{fmtDate(b.startDate)}</td>
                    <td className="whitespace-nowrap">{fmtDate(b.endDate)}</td>
                    <td className="whitespace-nowrap">{fmtDate(b.createdAt)}</td>
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

export default function MyRentalsPage() {
  return (
    <RequireAuth roles={["customer"]} bare>
      <MyRentals />
    </RequireAuth>
  );
}
