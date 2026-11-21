"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const stats = [
  { value: "6", label: "Equipment categories" },
  { value: "3", label: "Flexible rental types" },
  { value: "100%", label: "Admin-approved listings" },
];

export default function OwnerCta() {
  return (
    <section className="section-y pt-0">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-neutral p-8 text-neutral-content sm:p-12"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Own equipment sitting idle?</h2>
              <p className="mt-3 max-w-lg leading-relaxed opacity-80">
                List it on RentoGear, set your own price and rental period, and earn every time someone books it. Track
                bookings and earnings from your owner dashboard.
              </p>
              <Link href="/register" className="btn btn-accent mt-6">
                Become an owner <FiArrowRight />
              </Link>
            </div>
            <dl className="grid grid-cols-3 gap-4 text-center">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 p-4">
                  <dt className="text-3xl font-extrabold text-accent">{s.value}</dt>
                  <dd className="mt-1 text-xs opacity-80">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
