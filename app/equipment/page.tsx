"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import EquipmentCard, { EquipmentCardSkeleton } from "@/components/EquipmentCard";
import { EmptyState, ErrorBox, Pagination } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { CATEGORIES, RENTAL_TYPES, type Equipment, type Paged } from "@/lib/types";

const LIMIT = 9;

function Explorer() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [rentalType, setRentalType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // search text and price boxes wait 400ms after typing before calling the server
  const [typed, setTyped] = useState({ q, minPrice, maxPrice });
  useEffect(() => {
    const t = setTimeout(() => setTyped({ q, minPrice, maxPrice }), 400);
    return () => clearTimeout(t);
  }, [q, minPrice, maxPrice]);

  const [data, setData] = useState<Paged<Equipment> | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setData(null);
    api<Paged<Equipment>>("/equipment", {
      auth: false,
      query: {
        q: typed.q.trim(),
        category: category === "all" ? "" : category,
        rentalType: rentalType === "all" ? "" : rentalType,
        minPrice: typed.minPrice,
        maxPrice: typed.maxPrice,
        availability: availability === "all" ? "" : availability,
        sort,
        page,
        limit: LIMIT,
      },
    })
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, [typed, category, rentalType, availability, sort, page, reload]);

  const reset = () => {
    setQ("");
    setCategory("all");
    setRentalType("all");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setSort("newest");
    setPage(1);
  };

  // any filter change goes back to page 1
  const on =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      setPage(1);
    };

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All Equipment</h1>
        <p className="mt-2 opacity-70">Search, filter and sort approved equipment from verified owners.</p>
      </div>

      <div className="mb-8 rounded-box border border-base-300 bg-base-100 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative sm:col-span-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              className="input input-bordered w-full pl-10"
              placeholder="Search by name or location"
              value={q}
              onChange={(e) => on(setQ)(e.target.value)}
            />
          </label>

          <select className="select select-bordered w-full" value={category} onChange={(e) => on(setCategory)(e.target.value)} aria-label="Category">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select className="select select-bordered w-full" value={rentalType} onChange={(e) => on(setRentalType)(e.target.value)} aria-label="Rental type">
            <option value="all">Any rental type</option>
            {RENTAL_TYPES.map((t) => (
              <option key={t} value={t} className="capitalize">{t[0].toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            className="input input-bordered w-full"
            placeholder="Min price ($)"
            value={minPrice}
            onChange={(e) => on(setMinPrice)(e.target.value)}
          />
          <input
            type="number"
            min={0}
            className="input input-bordered w-full"
            placeholder="Max price ($)"
            value={maxPrice}
            onChange={(e) => on(setMaxPrice)(e.target.value)}
          />

          <select className="select select-bordered w-full" value={availability} onChange={(e) => on(setAvailability)(e.target.value)} aria-label="Availability">
            <option value="all">Any availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select className="select select-bordered w-full" value={sort} onChange={(e) => on(setSort)(e.target.value)} aria-label="Sort by">
            <option value="newest">Recently added</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="opacity-70">
            {data ? `${data.total} ${data.total === 1 ? "item" : "items"} found` : "Loading equipment..."}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={reset}>
            <FiRefreshCw /> Reset filters
          </button>
        </div>
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : data === null ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <EquipmentCardSkeleton key={i} />
          ))}
        </div>
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No equipment found"
          text="Try a different search or clear some filters."
          action={<button className="btn btn-primary btn-sm" onClick={reset}>Clear filters</button>}
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
          <Pagination
            page={data.page}
            pages={data.pages}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense fallback={<div className="container-page py-10"><div className="skeleton h-96 w-full" /></div>}>
      <Explorer />
    </Suspense>
  );
}
