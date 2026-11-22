"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import DashHeader, { TableSkeleton } from "@/components/DashHeader";
import ConfirmModal from "@/components/ConfirmModal";
import EquipmentForm from "@/components/EquipmentForm";
import { EmptyState, ErrorBox, Pagination, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Equipment, EquipmentStatus, Paged } from "@/lib/types";
import { money, rentalLabel } from "@/lib/utils";

// One table for both roles: owners see their own items, admins see everything and can approve / reject.
export default function EquipmentTable({ admin }: { admin: boolean }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [data, setData] = useState<Paged<Equipment> | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState<Equipment | null>(null);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setData(
        await api<Paged<Equipment>>(admin ? "/admin/equipment" : "/owner/equipment", {
          query: { page, limit: 8, status: admin ? status : undefined },
        })
      );
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [admin, page, status]);

  useEffect(() => {
    setData(null);
    load();
  }, [load]);

  const setItemStatus = async (item: Equipment, next: EquipmentStatus) => {
    setBusyId(item._id);
    try {
      await api(`/admin/equipment/${item._id}/status`, { method: "PATCH", body: { status: next } });
      toast.success(`Equipment ${next}`);
      await load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId("");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusyId(deleting._id);
    try {
      await api(`/equipment/${deleting._id}`, { method: "DELETE" });
      toast.success("Equipment deleted");
      setDeleting(null);
      if (data && data.items.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <DashHeader
        title={admin ? "Manage Equipment" : "My Equipment"}
        subtitle={admin ? "Approve, reject, edit or remove any listing" : "Update or remove your listings"}
        action={
          admin ? (
            <select
              className="select select-bordered select-sm"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          ) : (
            <Link href="/dashboard/add-equipment" className="btn btn-primary btn-sm">
              Add equipment
            </Link>
          )
        }
      />

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !data ? (
        <TableSkeleton cols={6} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No equipment found"
          text={admin ? "Nothing matches this filter." : "List your first piece of equipment to start earning."}
          action={!admin && <Link href="/dashboard/add-equipment" className="btn btn-primary btn-sm">Add equipment</Link>}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  {admin && <th>Owner</th>}
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((e) => (
                  <tr key={e._id} className="hover:bg-base-200/60">
                    <td>
                      <div className="flex items-center gap-3 font-semibold">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={e.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="line-clamp-1 min-w-32">{e.name}</span>
                      </div>
                    </td>
                    <td>{e.category}</td>
                    {admin && <td className="whitespace-nowrap">{e.owner?.name}</td>}
                    <td className="whitespace-nowrap font-semibold">
                      {money(e.price)} / {rentalLabel[e.rentalType]}
                    </td>
                    <td>{e.quantity}</td>
                    <td><StatusBadge value={e.status} /></td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {admin && e.status !== "approved" && (
                          <button
                            className="btn btn-success btn-soft btn-sm"
                            onClick={() => setItemStatus(e, "approved")}
                            disabled={busyId === e._id}
                            title="Approve"
                          >
                            <FiCheck /> Approve
                          </button>
                        )}
                        {admin && e.status !== "rejected" && (
                          <button
                            className="btn btn-warning btn-soft btn-sm"
                            onClick={() => setItemStatus(e, "rejected")}
                            disabled={busyId === e._id}
                            title="Reject"
                          >
                            <FiX /> Reject
                          </button>
                        )}
                        <button className="btn btn-primary btn-soft btn-sm" onClick={() => setEditing(e)} title="Update">
                          <FiEdit2 /> Update
                        </button>
                        <button className="btn btn-error btn-soft btn-sm" onClick={() => setDeleting(e)} title="Delete">
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}

      {editing && (
        <dialog className="modal modal-open">
          <div className="modal-box max-h-[90vh] w-11/12 max-w-3xl">
            <h3 className="mb-4 text-lg font-bold">Update equipment</h3>
            <EquipmentForm
              initial={editing}
              submitLabel="Save changes"
              onCancel={() => setEditing(null)}
              onSubmit={async (body) => {
                await api(`/equipment/${editing._id}`, { method: "PUT", body });
                toast.success("Equipment updated");
                setEditing(null);
                await load();
              }}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setEditing(null)} />
        </dialog>
      )}

      {deleting && (
        <ConfirmModal
          title="Delete equipment?"
          text={`"${deleting.name}" will be removed permanently. This cannot be undone.`}
          busy={busyId === deleting._id}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
