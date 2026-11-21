"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft, FiBox, FiHeart, FiMapPin, FiShield, FiTag } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import RequireAuth from "@/components/RequireAuth";
import BookingModal from "@/components/BookingModal";
import { useAuth } from "@/components/AuthProvider";
import { ErrorBox, StatusBadge } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Equipment } from "@/lib/types";
import { money, rentalLabel } from "@/lib/utils";

function Details() {
  const { id } = useParams<{ id: string }>();
  const { me } = useAuth();
  const [item, setItem] = useState<Equipment | null>(null);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [favBusy, setFavBusy] = useState(false);
  const [booking, setBooking] = useState(false);

  const load = useCallback(async () => {
    setError("");
    setItem(null);
    try {
      setItem(await api<Equipment>(`/equipment/${id}`));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const isCustomer = me?.role === "customer";

  useEffect(() => {
    if (!isCustomer) return;
    api<string[]>("/favorites/ids")
      .then((ids) => setFavorite(ids.includes(id)))
      .catch(() => {});
  }, [isCustomer, id]);

  const toggleFavorite = async () => {
    setFavBusy(true);
    try {
      if (favorite) {
        await api(`/favorites/${id}`, { method: "DELETE" });
        setFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api(`/favorites/${id}`, { method: "POST" });
        setFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setFavBusy(false);
    }
  };

  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorBox message={error} onRetry={load} />
        <div className="mt-6 text-center">
          <Link href="/equipment" className="btn btn-ghost">Back to all equipment</Link>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container-page grid gap-8 py-10 lg:grid-cols-2">
        <div className="skeleton aspect-[4/3] w-full" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  const available = item.quantity > 0;
  const isOwnItem = me?.email === item.owner.email;

  const info = [
    { icon: FiTag, label: "Category", value: item.category },
    { icon: FiMapPin, label: "Location", value: item.location },
    { icon: FiBox, label: "Available quantity", value: String(item.quantity) },
    { icon: FiShield, label: "Condition", value: item.condition },
  ];

  return (
    <div className="container-page py-8 sm:py-10">
      <Link href="/equipment" className="btn btn-ghost btn-sm mb-6">
        <FiArrowLeft /> All equipment
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.name} className="aspect-[4/3] w-full object-cover" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`badge ${available ? "badge-success" : "badge-error"}`}>
              {available ? "Available" : "Unavailable"}
            </span>
            {item.status !== "approved" && <StatusBadge value={item.status} />}
            <span className="badge badge-outline capitalize">{item.rentalType} rental</span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{item.name}</h1>
          <p className="mt-1 text-sm opacity-70">
            {item.brand} · {item.model}
          </p>

          <p className="mt-5 text-4xl font-extrabold text-primary">
            {money(item.price)} <span className="text-base font-medium opacity-60">/ {rentalLabel[item.rentalType]}</span>
          </p>

          <p className="mt-5 leading-relaxed opacity-80">{item.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-base-300 p-3">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-60">
                  <Icon /> {label}
                </dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            {isCustomer && available && item.status === "approved" && (
              <button className="btn btn-primary btn-lg flex-1 sm:flex-none" onClick={() => setBooking(true)}>
                Book Now
              </button>
            )}
            {isCustomer && (
              <button className="btn btn-outline btn-lg" onClick={toggleFavorite} disabled={favBusy}>
                {favorite ? <FaHeart className="text-error" /> : <FiHeart />}
                {favorite ? "Saved" : "Add to favorites"}
              </button>
            )}
          </div>

          {!isCustomer && (
            <p className="mt-4 rounded-xl bg-base-200 p-3 text-sm opacity-80">
              {isOwnItem
                ? "This is your own listing."
                : "Only customer accounts can book equipment or save favorites."}
            </p>
          )}
          {isCustomer && !available && (
            <p className="mt-4 rounded-xl bg-base-200 p-3 text-sm opacity-80">
              This equipment is currently unavailable.
            </p>
          )}

          <div className="mt-8 rounded-box border border-base-300 p-5">
            <h2 className="font-bold">Rental terms and conditions</h2>
            <p className="mt-2 text-sm leading-relaxed opacity-75">{item.terms}</p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-box border border-base-300 p-5">
            <div className="avatar">
              <div className="w-12 rounded-full">
                {item.owner.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.owner.image} alt={item.owner.name} referrerPolicy="no-referrer" />
                ) : (
                  <span className="grid h-full w-full place-items-center bg-primary font-bold text-primary-content">
                    {item.owner.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-60">Equipment owner</p>
              <p className="truncate font-bold">{item.owner.name}</p>
              <p className="truncate text-sm opacity-70">{item.owner.email}</p>
            </div>
          </div>
        </div>
      </div>

      {booking && me && (
        <BookingModal
          equipment={item}
          defaultAddress={me.address}
          defaultPhone={me.phone}
          onClose={() => setBooking(false)}
        />
      )}
    </div>
  );
}

export default function EquipmentDetailsPage() {
  return (
    <RequireAuth>
      <Details />
    </RequireAuth>
  );
}
