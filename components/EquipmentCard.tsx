"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMapPin } from "react-icons/fi";
import { useAuth } from "./AuthProvider";
import type { Equipment } from "@/lib/types";
import { money, rentalLabel } from "@/lib/utils";

export function EquipmentCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

export default function EquipmentCard({ item }: { item: Equipment }) {
  const { status } = useAuth();
  const router = useRouter();
  const available = item.quantity > 0;
  const href = `/equipment/${item._id}`;

  // Not logged in -> View Details sends the visitor to Login first
  const onView = (e: React.MouseEvent) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      router.push(`/login?next=${encodeURIComponent(href)}`);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className={`badge absolute left-3 top-3 ${available ? "badge-success" : "badge-error"}`}>
          {available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">{item.category}</span>
        <h3 className="mt-1 line-clamp-1 text-lg font-bold">{item.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm opacity-70">
          <FiMapPin className="shrink-0" /> <span className="line-clamp-1">{item.location}</span>
        </p>

        <div className="mt-4 flex items-end justify-between">
          <p>
            <span className="text-2xl font-extrabold">{money(item.price)}</span>
            <span className="text-sm opacity-70"> / {rentalLabel[item.rentalType]}</span>
          </p>
          <span className="badge badge-outline capitalize">{item.rentalType}</span>
        </div>

        <div className="mt-auto pt-5">
          <Link href={href} onClick={onView} className="btn btn-primary w-full">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
