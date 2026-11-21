"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GiFarmTractor } from "react-icons/gi";
import { MdCameraAlt, MdConstruction, MdCelebration, MdDevices, MdLocalShipping } from "react-icons/md";
import { SectionHeading } from "@/components/ui";
import { api } from "@/lib/api";

const categories = [
  { name: "Construction Equipment", icon: MdConstruction, text: "Excavators, mixers, compactors" },
  { name: "Photography Equipment", icon: MdCameraAlt, text: "Cameras, lenses, studio lights" },
  { name: "Vehicles & Transportation", icon: MdLocalShipping, text: "Pickups, vans, trucks" },
  { name: "Agriculture Equipment", icon: GiFarmTractor, text: "Tillers, sprayers, pumps" },
  { name: "Electronics", icon: MdDevices, text: "Laptops, projectors, displays" },
  { name: "Event Equipment", icon: MdCelebration, text: "Tents, sound, staging" },
];

export default function Categories() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    api<{ name: string; count: number }[]>("/equipment/categories", { auth: false })
      .then((rows) => setCounts(Object.fromEntries(rows.map((r) => [r.name, r.count]))))
      .catch(() => {});
  }, []);

  return (
    <section className="section-y bg-base-200">
      <div className="container-page">
        <SectionHeading
          eyebrow="Categories"
          title="Popular equipment categories"
          subtitle="Whatever the job, start with the category that fits."
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map(({ name, icon: Icon, text }) => (
            <motion.div key={name} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <Link
                href={`/equipment?category=${encodeURIComponent(name)}`}
                className="group flex h-full items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{name}</span>
                  <span className="block text-sm opacity-70">{text}</span>
                  {counts[name] !== undefined && (
                    <span className="mt-1 block text-xs font-semibold text-primary">
                      {counts[name]} {counts[name] === 1 ? "listing" : "listings"}
                    </span>
                  )}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
