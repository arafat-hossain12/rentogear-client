"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import EquipmentCard, { EquipmentCardSkeleton } from "@/components/EquipmentCard";
import { EmptyState, ErrorBox, SectionHeading } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import type { Equipment } from "@/lib/types";

export default function Featured() {
  const [items, setItems] = useState<Equipment[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setItems(null);
    try {
      setItems(await api<Equipment[]>("/equipment/featured", { auth: false }));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Featured equipment"
          title="Ready to rent today"
          subtitle="Freshly approved listings from verified owners. Pick one and book it in minutes."
        />

        {error ? (
          <ErrorBox message={error} onRetry={load} />
        ) : items === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EquipmentCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="No equipment listed yet" text="Owners can add equipment from their dashboard." />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => (
              <motion.div
                key={item._id}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                className="h-full"
              >
                <EquipmentCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <Link href="/equipment" className="btn btn-outline">
            View all equipment <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
