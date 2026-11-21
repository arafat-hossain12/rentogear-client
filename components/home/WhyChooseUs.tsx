"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiDollarSign, FiLock, FiShield } from "react-icons/fi";
import { SectionHeading } from "@/components/ui";

const features = [
  {
    icon: FiDollarSign,
    title: "Affordable rental prices",
    text: "Owners set transparent daily, weekly or monthly rates. You see the total before you pay.",
  },
  {
    icon: FiShield,
    title: "Verified equipment owners",
    text: "Every listing is reviewed and approved by our admins before it appears on the marketplace.",
  },
  {
    icon: FiCalendar,
    title: "Flexible rental periods",
    text: "Need it for a weekend or a whole season? Choose your own start and end dates.",
  },
  {
    icon: FiLock,
    title: "Secure online payments",
    text: "Payments are handled by Stripe Checkout, and your booking is confirmed automatically.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why choose us"
          title="Renting made simple and safe"
          subtitle="Everything you need to rent with confidence, from the first search to the final return."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-box border border-base-300 bg-base-100 p-6"
            >
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/20 text-accent-content">
                <Icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-70">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
