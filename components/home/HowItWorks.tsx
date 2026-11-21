"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui";

const steps = [
  { n: "01", title: "Find your equipment", text: "Search by name or location, then filter by category, price and availability." },
  { n: "02", title: "Pick your dates", text: "Choose the rental period and quantity. The total is calculated for you instantly." },
  { n: "03", title: "Pay and pick up", text: "Pay securely with Stripe. Your booking is confirmed and the owner is notified." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y scroll-mt-16 bg-base-200">
      <div className="container-page">
        <SectionHeading eyebrow="How it works" title="Rent in three simple steps" />
        <div className="relative grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative rounded-box border border-base-300 bg-base-100 p-7"
            >
              <span className="text-5xl font-extrabold text-primary/20">{s.n}</span>
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
