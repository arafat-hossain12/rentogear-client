"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import RequireAuth from "@/components/RequireAuth";
import DashHeader, { TableSkeleton } from "@/components/DashHeader";
import { EmptyState, ErrorBox } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Equipment } from "@/lib/types";
import { money, rentalLabel } from "@/lib/utils";

interface FavoriteRow {
  _id: string;
  equipment: Equipment;
}

function Favorites() {
  const [rows, setRows] = useState<FavoriteRow[] | null>(null);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState("");

  const load = useCallback(async () => {
    setError("");
    setRows(null);
    try {
      setRows(await api<FavoriteRow[]>("/favorites"));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (equipmentId: string) => {
    setRemoving(equipmentId);
    try {
      await api(`/favorites/${equipmentId}`, { method: "DELETE" });
      setRows((prev) => prev && prev.filter((r) => r.equipment._id !== equipmentId));
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setRemoving("");
    }
  };

  return (
    <>
      <DashHeader title="Favorites" subtitle="Equipment you saved for later" />

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !rows ? (
        <TableSkeleton cols={5} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          text="Tap the heart on an equipment page to save it here."
          action={<Link href="/equipment" className="btn btn-primary btn-sm">Browse equipment</Link>}
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Price</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ _id, equipment: e }) => (
                <tr key={_id} className="hover:bg-base-200/60">
                  <td>
                    <div className="flex items-center gap-3 font-semibold">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={e.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="line-clamp-1 min-w-32">{e.name}</span>
                    </div>
                  </td>
                  <td>{e.category}</td>
                  <td className="whitespace-nowrap font-semibold">
                    {money(e.price)} / {rentalLabel[e.rentalType]}
                  </td>
                  <td>{e.location}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/equipment/${e._id}`} className="btn btn-primary btn-sm">View Details</Link>
                      <button
                        className="btn btn-outline btn-error btn-sm"
                        onClick={() => remove(e._id)}
                        disabled={removing === e._id}
                      >
                        {removing === e._id && <span className="loading loading-spinner loading-xs" />} Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function FavoritesPage() {
  return (
    <RequireAuth roles={["customer"]} bare>
      <Favorites />
    </RequireAuth>
  );
}
