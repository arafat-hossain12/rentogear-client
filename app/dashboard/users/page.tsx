"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import RequireAuth from "@/components/RequireAuth";
import DashHeader, { TableSkeleton } from "@/components/DashHeader";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuth } from "@/components/AuthProvider";
import { EmptyState, ErrorBox, Pagination } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Paged, Role } from "@/lib/types";
import { fmtDate } from "@/lib/utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
  createdAt?: string;
}

function Users() {
  const { me } = useAuth();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<UserRow> | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [deleting, setDeleting] = useState<UserRow | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setData(await api<Paged<UserRow>>("/admin/users", { query: { page, limit: 8 } }));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [page]);

  useEffect(() => {
    setData(null);
    load();
  }, [load]);

  const changeRole = async (u: UserRow, role: Role) => {
    setBusyId(u.id);
    try {
      await api(`/admin/users/${u.id}/role`, { method: "PATCH", body: { role } });
      setData((d) => d && { ...d, items: d.items.map((x) => (x.id === u.id ? { ...x, role } : x)) });
      toast.success(`${u.name} is now ${role}`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId("");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusyId(deleting.id);
    try {
      await api(`/admin/users/${deleting.id}`, { method: "DELETE" });
      toast.success("User deleted");
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
      <DashHeader title="Manage Users" subtitle="Change roles or remove accounts" />

      {error ? (
        <ErrorBox message={error} onRetry={load} />
      ) : !data ? (
        <TableSkeleton cols={5} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => {
                  const self = u.id === me?.id;
                  return (
                    <tr key={u.id} className="hover:bg-base-200/60">
                      <td>
                        <div className="flex items-center gap-3 font-semibold">
                          <div className="avatar">
                            <div className="w-9 rounded-full">
                              {u.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={u.image} alt="" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="grid h-full w-full place-items-center bg-primary text-sm font-bold text-primary-content">
                                  {u.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="min-w-24">{u.name}</span>
                          {self && <span className="badge badge-neutral badge-sm">You</span>}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td className="whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                      <td>
                        <select
                          className="select select-bordered select-sm capitalize"
                          value={u.role}
                          disabled={self || busyId === u.id}
                          onChange={(e) => changeRole(u, e.target.value as Role)}
                          aria-label={`Role for ${u.name}`}
                        >
                          <option value="customer">customer</option>
                          <option value="owner">owner</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <div className="flex justify-end">
                          <button
                            className="btn btn-error btn-soft btn-sm"
                            disabled={self || busyId === u.id}
                            onClick={() => setDeleting(u)}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}

      {deleting && (
        <ConfirmModal
          title="Delete this user?"
          text={`${deleting.name} (${deleting.email}) and all their equipment listings will be removed. This cannot be undone.`}
          busy={busyId === deleting.id}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}

export default function UsersPage() {
  return (
    <RequireAuth roles={["admin"]} bare>
      <Users />
    </RequireAuth>
  );
}
